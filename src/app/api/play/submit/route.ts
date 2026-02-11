import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import db from "@/data/db";
import { calculateRatingDelta } from "@/domain/problem";
import { randomUUID } from "node:crypto";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { problemId, chosenId, timeMs } = body;

        if (!problemId || !chosenId) {
            return NextResponse.json(
                { success: false, error: { code: "INVALID_INPUT", message: "problemId and chosenId are required" } },
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

        // 1. Resolve Problem and User Standing
        const problem = await db.problem.findUnique({
            where: { id: problemId },
            select: { id: true, rating: true, correctChoice: true, archetypeId: true }
        });

        if (!problem || !problem.archetypeId) {
            return NextResponse.json(
                { success: false, error: { code: "NOT_FOUND", message: "Problem context missing" } },
                { status: 404 }
            );
        }

        const userArch = await db.userArchetype.findUnique({
            where: {
                userId_archetypeId: {
                    userId,
                    archetypeId: problem.archetypeId
                }
            }
        });

        if (!userArch) {
            return NextResponse.json(
                { success: false, error: { code: "FORBIDDEN", message: "Enrollment required" } },
                { status: 403 }
            );
        }

        // 2. Prevent Double Counting
        const existingAttempt = await db.attempt.findFirst({
            where: { userId, problemId }
        });

        if (existingAttempt) {
            return NextResponse.json(
                { success: false, error: { code: "ALREADY_SUBMITTED", message: "Attempt already recorded for this problem" } },
                { status: 409 }
            );
        }

        // 3. Process Result
        const isCorrect = problem.correctChoice === chosenId;
        const delta = calculateRatingDelta(userArch.rating, problem.rating, isCorrect);
        const newRating = userArch.rating + delta;

        // 4. Atomic Updates (Transaction)
        await db.$transaction([
            // Create Attempt
            db.attempt.create({
                data: {
                    id: randomUUID(),
                    userId,
                    problemId,
                    chosen: chosenId,
                    correct: isCorrect,
                    timeMs: timeMs || 0,
                    deltaUser: delta,
                    deltaProblem: 0, // Problems don't currently adapt
                }
            }),
            // Create Rating Event
            db.ratingEvent.create({
                data: {
                    id: randomUUID(),
                    userId,
                    problemId,
                    before: userArch.rating,
                    after: newRating,
                    delta: delta,
                    reason: "CALIBRATION_ATTEMPT"
                }
            }),
            // Update UserArchetype
            db.userArchetype.update({
                where: { id: userArch.id },
                data: {
                    rating: newRating,
                    attemptCount: { increment: 1 },
                    lastPlayedAt: new Date()
                }
            })
        ]);

        return NextResponse.json({
            success: true,
            data: {
                correct: isCorrect,
                newRating,
                delta
            }
        });

    } catch (error) {
        console.error("Submission error:", error);
        return NextResponse.json(
            { success: false, error: { code: "INTERNAL_ERROR", message: "Failed to log attempt" } },
            { status: 500 }
        );
    }
}
