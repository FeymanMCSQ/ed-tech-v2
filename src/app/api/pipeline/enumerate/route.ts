import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { enumerateProblems, EnumerationLevel } from '@/lib/pipeline/enumerate';

const enumerateSchema = z.object({
    level: z.enum(['SUBJECT', 'DOMAIN', 'ARCHETYPE']),
    query: z.string().optional().default(''),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = enumerateSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: 'Invalid input', issues: result.error.issues },
                { status: 400 }
            );
        }

        const data = await enumerateProblems({
            level: result.data.level as EnumerationLevel,
            query: result.data.query,
        });

        return NextResponse.json({
            success: true,
            data,
        });
    } catch (error: any) {
        console.error('[API/Enumerate] Error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
