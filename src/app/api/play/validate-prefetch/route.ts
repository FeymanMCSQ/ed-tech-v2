import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import db from "@/data/db";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const problemId = searchParams.get("problemId");

        if (!problemId) {
            return NextResponse.json(
                { success: false, error: { code: "INVALID_INPUT", message: "problemId required" } },
                { status: 400 }
            );
        }

        const cookieStore = await cookies();
        const userId = cookieStore.get("auth-user-id")?.value;

        if (!userId) {
            return NextResponse.json(
                { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required" } },
                { status: 401 }
            );
        }

        const problem = await db.problem.findUnique({
            where: { id: problemId },
            select: { correctChoice: true, archetypeId: true }
        });

        if (!problem) {
            return NextResponse.json(
                { success: false, error: { code: "NOT_FOUND", message: "Problem not found" } },
                { status: 404 }
            );
        }

        // Verify user is enrolled to prevent scraping answers for unknown archetypes
        const enrollment = await db.userArchetype.findUnique({
            where: {
                userId_archetypeId: {
                    userId,
                    archetypeId: problem.archetypeId || ""
                }
            }
        });

        if (!enrollment) {
            return NextResponse.json(
                { success: false, error: { code: "FORBIDDEN", message: "Enrollment required to access calibration data" } },
                { status: 403 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                correctChoice: problem.correctChoice
            }
        });

    } catch (error) {
        console.error("Prefetch error:", error);
        return NextResponse.json(
            { success: false, error: { code: "INTERNAL_ERROR", message: "Internal server error" } },
            { status: 500 }
        );
    }
}
