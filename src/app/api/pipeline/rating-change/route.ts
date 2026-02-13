import { NextResponse } from "next/server";
import db from "@/data/db";
import { RatingChangeSchema } from "@/domain/pipeline";
import { nanoid } from "nanoid";

export async function POST(request: Request) {
    try {
        let body;
        try {
            body = await request.json();
        } catch (e: any) {
            return NextResponse.json({
                success: false,
                error: {
                    code: "SYNTAX_ERROR",
                    message: "Invalid JSON format: " + e.message
                }
            }, { status: 400 });
        }

        const result = RatingChangeSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({
                success: false,
                error: {
                    code: "VALIDATION_ERROR",
                    message: "Validation failed",
                    details: result.error.format()
                }
            }, { status: 400 });
        }

        const { userId, archetypeId, rating } = result.data;

        const updatedUA = await db.$transaction(async (tx) => {
            // 1. Find the UserArchetype
            const userArchetype = await tx.userArchetype.findUnique({
                where: {
                    userId_archetypeId: {
                        userId,
                        archetypeId
                    }
                }
            });

            if (!userArchetype) {
                throw new Error("NOT_FOUND: UserArchetype record not found for this user and archetype");
            }

            const oldRating = userArchetype.rating;

            // 2. Update the rating
            const updated = await tx.userArchetype.update({
                where: { id: userArchetype.id },
                data: {
                    rating,
                    updatedAt: new Date()
                }
            });

            // 3. Log the RatingEvent
            await tx.ratingEvent.create({
                data: {
                    id: `re_${nanoid(12)}`,
                    userId,
                    problemId: null, // Manual adjustment, not tied to a problem
                    before: oldRating,
                    after: rating,
                    delta: rating - oldRating,
                    reason: "PIPELINE_MANUAL_ADJUSTMENT"
                }
            });

            return updated;
        });

        return NextResponse.json({
            success: true,
            data: updatedUA
        });

    } catch (error: any) {
        if (error.message.startsWith("NOT_FOUND:")) {
            return NextResponse.json({
                success: false,
                error: {
                    code: "NOT_FOUND",
                    message: error.message.replace("NOT_FOUND: ", "")
                }
            }, { status: 404 });
        }

        return NextResponse.json({
            success: false,
            error: {
                code: "INTERNAL_ERROR",
                message: error.message || "An unexpected error occurred"
            }
        }, { status: 500 });
    }
}
