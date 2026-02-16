import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import db from "@/data/db";
import { formatProblemView } from "@/domain/problem";
import { randomUUID } from "node:crypto";

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

        let userRating = 200; // Default if not found

        if (!userArch) {
            // Auto-initialize for authenticated users if they are missing the record
            // This happens when new archetypes are added to a domain after enrollment
            const newArch = await db.userArchetype.create({
                data: {
                    id: randomUUID(),
                    userId,
                    archetypeId: archetype.id,
                    rating: 200,
                    updatedAt: new Date()
                },
                select: { rating: true }
            });
            userRating = newArch.rating;
        } else {
            userRating = userArch.rating;
        }

        // 3. Fetch Attempt History (Avoid repeats)
        const attempts = await db.attempt.findMany({
            where: { userId },
            select: { problemId: true }
        });
        const attemptedIds = attempts.map(a => a.problemId);

        // 4. Selection Engine (Simple Calibration)
        // Find NEW problems for this archetype with rating in [rating - 200, rating + 200]
        const problems = await db.problem.findMany({
            where: {
                archetypeId: archetype.id,
                rating: {
                    gte: userRating - 200,
                    lte: userRating + 200
                },
                id: { notIn: attemptedIds }
            },
            select: {
                id: true,
                type: true,
                promptLatex: true,
                choices: true,
                topic: true,
                tags: true,
                rating: true,
                solutions: true,
                Archetype: {
                    select: {
                        Domain: {
                            select: {
                                Subject: {
                                    select: { order: true }
                                }
                            }
                        }
                    }
                }
            },
            take: 10
        });

        // 5. Resolution with Fallback
        // If no unattempted problems in range, try any unattempted problem in archetype
        const selectedProblem = problems.length > 0
            ? problems[Math.floor(Math.random() * problems.length)]
            : await db.problem.findFirst({
                where: {
                    archetypeId: archetype.id,
                    id: { notIn: attemptedIds }
                },
                select: {
                    id: true,
                    type: true,
                    promptLatex: true,
                    choices: true,
                    topic: true,
                    tags: true,
                    rating: true,
                    solutions: true,
                    Archetype: {
                        select: {
                            Domain: {
                                select: {
                                    Subject: {
                                        select: { order: true }
                                    }
                                }
                            }
                        }
                    }
                }
            });

        if (!selectedProblem) {
            return NextResponse.json(
                { success: false, error: { code: "NO_PROBLEMS", message: "No unattempted problems available for this calibration level" } },
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
