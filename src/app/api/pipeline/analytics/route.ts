import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { cookies } from 'next/headers';
import db from '@/data/db';

const querySchema = z.object({
    archetypeId: z.string().min(1),
});

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const url = new URL(req.url);
        const parsed = querySchema.safeParse({
            archetypeId: url.searchParams.get('archetypeId') ?? '',
        });

        if (!parsed.success) {
            return NextResponse.json(
                { success: false, error: { code: 'INVALID_INPUT', message: 'archetypeId is required' } },
                { status: 400 }
            );
        }

        const { archetypeId } = parsed.data;

        const cookieStore = await cookies();
        const userId = cookieStore.get('auth-user-id')?.value;

        if (!userId) {
            return NextResponse.json(
                { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
                { status: 401 }
            );
        }

        // 1. Resolve archetype
        const archetype = await db.archetype.findUnique({
            where: { id: archetypeId },
            select: { id: true, title: true, slug: true },
        });

        if (!archetype) {
            return NextResponse.json(
                { success: false, error: { code: 'NOT_FOUND', message: 'Archetype not found' } },
                { status: 404 }
            );
        }

        // 2. Resolve user standing for this archetype
        const userArchetype = await db.userArchetype.findUnique({
            where: { userId_archetypeId: { userId, archetypeId } },
            select: { rating: true, attemptCount: true },
        });

        if (!userArchetype) {
            return NextResponse.json(
                { success: false, error: { code: 'NOT_FOUND', message: 'Not enrolled in this archetype' } },
                { status: 404 }
            );
        }

        // 3. Fetch all attempts for this user on problems belonging to this archetype
        const attempts = await db.attempt.findMany({
            where: {
                userId,
                Problem: { archetypeId },
            },
            select: {
                id: true,
                createdAt: true,
                correct: true,
                timeMs: true,
                deltaUser: true,
                deltaProblem: true,
                chosen: true,
                Problem: {
                    select: {
                        id: true,
                        rating: true,
                        topic: true,
                    },
                },
            },
            orderBy: { createdAt: 'asc' },
        });

        // 4. Compute cumulative rating trend
        // Starting rating is the current rating minus all deltas (to reconstruct the starting point)
        const totalDelta = attempts.reduce((sum, a) => sum + a.deltaUser, 0);
        const startingRating = userArchetype.rating - totalDelta;

        let runningRating = startingRating;
        const ratingTrend = attempts.map((a, index) => {
            runningRating += a.deltaUser;
            return { attemptIndex: index + 1, rating: runningRating, createdAt: a.createdAt };
        });

        // 5. Format attempts for response
        const formattedAttempts = attempts.map((a) => ({
            id: a.id,
            createdAt: a.createdAt.toISOString(),
            correct: a.correct,
            timeMs: a.timeMs,
            deltaUser: a.deltaUser,
            deltaProblem: a.deltaProblem,
            chosen: a.chosen,
            problem: {
                id: a.Problem.id,
                rating: a.Problem.rating,
                topic: a.Problem.topic,
            },
        }));

        return NextResponse.json({
            success: true,
            data: {
                archetype: { id: archetype.id, title: archetype.title, slug: archetype.slug },
                userRating: userArchetype.rating,
                userAttemptCount: userArchetype.attemptCount,
                attempts: formattedAttempts,
                ratingTrend: ratingTrend.map((t) => ({
                    attemptIndex: t.attemptIndex,
                    rating: t.rating,
                    createdAt: t.createdAt.toISOString(),
                })),
            },
        });
    } catch (error) {
        console.error('[Pipeline/Analytics] Error:', error);
        return NextResponse.json(
            { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch analytics' } },
            { status: 500 }
        );
    }
}
