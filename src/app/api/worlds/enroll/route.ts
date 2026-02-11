import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import db from "@/data/db";
import { randomUUID } from "node:crypto";

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get("auth-user-id")?.value;

        if (!userId) {
            return NextResponse.json(
                { success: false, error: { code: "UNAUTHORIZED", message: "Login required for enrollment" } },
                { status: 401 }
            );
        }

        const { domainId } = await request.json();

        if (!domainId) {
            return NextResponse.json(
                { success: false, error: { code: "BAD_REQUEST", message: "domainId is required" } },
                { status: 400 }
            );
        }

        // Fetch all archetypes in this domain
        const archetypes = await db.archetype.findMany({
            where: { domainId }
        });

        if (archetypes.length === 0) {
            return NextResponse.json(
                { success: false, error: { code: "NOT_FOUND", message: "No archetypes found in this domain" } },
                { status: 404 }
            );
        }

        // Identify existing enrollments to avoid duplicates
        const existing = await db.userArchetype.findMany({
            where: {
                userId,
                archetypeId: { in: archetypes.map(a => a.id) }
            },
            select: { archetypeId: true }
        });

        const existingIds = new Set(existing.map(e => e.archetypeId));
        const toCreate = archetypes.filter(a => !existingIds.has(a.id));

        if (toCreate.length > 0) {
            // Create user archetypes with initial rating of 200
            await db.userArchetype.createMany({
                data: toCreate.map(a => ({
                    id: randomUUID(),
                    userId,
                    archetypeId: a.id,
                    rating: 200,
                    updatedAt: new Date(),
                }))
            });
        }

        return NextResponse.json({
            success: true,
            message: `Enrolled in ${toCreate.length} new archetypes.`,
            enrolledCount: archetypes.length
        });

    } catch (error) {
        console.error("Enrollment error:", error);
        return NextResponse.json(
            { success: false, error: { code: "INTERNAL_ERROR", message: "Failed to initialize enrollment" } },
            { status: 500 }
        );
    }
}
