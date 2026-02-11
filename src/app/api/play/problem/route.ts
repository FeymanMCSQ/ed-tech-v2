import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import db from "@/data/db";
import { formatProblemView } from "@/domain/problem";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const archetypeSlug = searchParams.get("archetypeSlug");

        if (!archetypeSlug) {
            return NextResponse.json(
                { success: false, error: { code: "INVALID_INPUT", message: "Archetype slug required" } },
                { status: 400 }
            );
        }

        // 1. Resolve Archetype
        const archetype = await db.archetype.findUnique({
            where: { slug: archetypeSlug },
            select: { id: true, title: true }
        });

        if (!archetype) {
            return NextResponse.json(
                { success: false, error: { code: "NOT_FOUND", message: "Archetype not found" } },
                { status: 404 }
            );
        }

        // 2. Resolve User Standing
        const cookieStore = await cookies();
        const userId = cookieStore.get("auth-user-id")?.value;

        if (!userId) {
            return NextResponse.json(
                { success: false, error: { code: "UNAUTHORIZED", message: "Calibration requires an active session" } },
                { status: 401 }
            );
        }

        const userArch = await db.userArchetype.findUnique({
            where: {
                userId_archetypeId: {
                    userId,
                    archetypeId: archetype.id
                }
            },
            select: { rating: true }
        });

        if (!userArch) {
            return NextResponse.json(
                { success: false, error: { code: "FORBIDDEN", message: "You must initialize this domain before calibration" } },
                { status: 403 }
            );
        }

        const userRating = userArch.rating;

        // 3. Selection Engine (Simple Calibration)
        // Find problems for this archetype with rating in [rating - 200, rating + 200]
        // In a real system, this would be more complex (e.g. tracking seen problems)
        const problems = await db.problem.findMany({
            where: {
                archetypeId: archetype.id,
                rating: {
                    gte: userRating - 200,
                    lte: userRating + 200
                }
            },
            take: 10
        });

        const selectedProblem = problems.length > 0
            ? problems[Math.floor(Math.random() * problems.length)]
            : await db.problem.findFirst({ where: { archetypeId: archetype.id } });

        if (!selectedProblem) {
            return NextResponse.json(
                { success: false, error: { code: "NO_PROBLEMS", message: "No problems available for this calibration level" } },
                { status: 404 }
            );
        }

        const formatted = formatProblemView(selectedProblem, userRating);

        return NextResponse.json({
            success: true,
            data: formatted
        });

    } catch (error) {
        console.error("Problem selection failure:", error);
        return NextResponse.json(
            { success: false, error: { code: "INTERNAL_ERROR", message: "Failed to fetch calibration problem" } },
            { status: 500 }
        );
    }
}
