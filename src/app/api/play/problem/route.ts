import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import db from "@/data/db";
import { formatProblemViewFromRow } from "@/domain/problem";
import { randomUUID } from "node:crypto";
import { Prisma } from "@/prisma";

interface ProblemRow {
    id: string;
    type: string;
    promptLatex: string;
    choices: any;
    topic: string;
    tags: string[];
    rating: number;
    solutions: string | null;
    userRating: number;
    attemptCount: number;
    subjectOrder: number | null;
}

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

        // 1. Resolve Archetype (fast, indexed lookup)
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

        // 2. Resolve User
        const cookieStore = await cookies();
        const userId = cookieStore.get("auth-user-id")?.value;

        if (!userId) {
            return NextResponse.json(
                { success: false, error: { code: "UNAUTHORIZED", message: "Calibration requires an active session" } },
                { status: 401 }
            );
        }

        // 3. Ensure UserArchetype exists (rare cold-start path)
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
            await db.userArchetype.create({
                data: {
                    id: randomUUID(),
                    userId,
                    archetypeId: archetype.id,
                    rating: 200,
                    updatedAt: new Date()
                }
            });
        }

        // 4. Single raw SQL query: fetch problem + user rating + attempt count
        const rows = await db.$queryRaw<ProblemRow[]>(Prisma.sql`
            WITH user_standing AS (
                SELECT "rating"
                FROM "UserArchetype"
                WHERE "userId" = ${userId} AND "archetypeId" = ${archetype.id}
                LIMIT 1
            ),
            arch_attempts AS (
                SELECT COUNT(*)::int AS "attemptCount"
                FROM "Attempt" a
                JOIN "Problem" p ON a."problemId" = p."id"
                WHERE a."userId" = ${userId} AND p."archetypeId" = ${archetype.id}
            ),
            candidates AS (
                SELECT p."id", p."type", p."promptLatex", p."choices",
                       p."topic", p."tags", p."rating", p."solutions", p."archetypeId"
                FROM "Problem" p
                WHERE p."archetypeId" = ${archetype.id}
                  AND p."id" NOT IN (
                      SELECT "problemId" FROM "Attempt" WHERE "userId" = ${userId}
                  )
                  AND p."rating" BETWEEN
                      (SELECT "rating" - 200 FROM user_standing)
                      AND
                      (SELECT "rating" + 200 FROM user_standing)
                ORDER BY RANDOM()
                LIMIT 1
            ),
            fallback AS (
                SELECT p."id", p."type", p."promptLatex", p."choices",
                       p."topic", p."tags", p."rating", p."solutions", p."archetypeId"
                FROM "Problem" p
                WHERE p."archetypeId" = ${archetype.id}
                  AND p."id" NOT IN (
                      SELECT "problemId" FROM "Attempt" WHERE "userId" = ${userId}
                  )
                  AND NOT EXISTS (SELECT 1 FROM candidates)
                ORDER BY RANDOM()
                LIMIT 1
            )
            SELECT
                COALESCE(c."id", f."id") AS "id",
                COALESCE(c."type", f."type")::text AS "type",
                COALESCE(c."promptLatex", f."promptLatex") AS "promptLatex",
                COALESCE(c."choices", f."choices") AS "choices",
                COALESCE(c."topic", f."topic") AS "topic",
                COALESCE(c."tags", f."tags") AS "tags",
                COALESCE(c."rating", f."rating")::int AS "rating",
                COALESCE(c."solutions", f."solutions") AS "solutions",
                us."rating"::int AS "userRating",
                aa."attemptCount",
                s."order"::int AS "subjectOrder"
            FROM user_standing us
            CROSS JOIN arch_attempts aa
            LEFT JOIN candidates c ON true
            LEFT JOIN fallback f ON true
            LEFT JOIN "Archetype" arch ON arch."id" = ${archetype.id}
            LEFT JOIN "Domain" d ON d."id" = arch."domainId"
            LEFT JOIN "Subject" s ON s."id" = d."subjectId"
            LIMIT 1
        `);

        if (!rows || rows.length === 0 || !rows[0].id) {
            return NextResponse.json(
                { success: false, error: { code: "NO_PROBLEMS", message: "No unattempted problems available for this calibration level" } },
                { status: 404 }
            );
        }

        const formatted = formatProblemViewFromRow(rows[0]);

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
