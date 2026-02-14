import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { buildPrompt } from '@/lib/prompts/factory';
import { generateContent } from '@/lib/ai/generate';
import { parseAndValidateAiBatch } from '@/lib/validators/parseAndValidateAiBatch';
import { insertGeneratedProblems } from '@/lib/db/insertProblems';
import { AiBatchError } from '@/lib/validators/errors';
import { ZodError } from 'zod';

const bodySchema = z.object({
    archetypeId: z.string().min(1),
    type: z.enum(['MCQ', 'NUMERIC', 'EXPRESSION', 'OPEN']).default('MCQ'),
    band: z.string().min(1), // e.g., "400_600"
    count: z.number().int().min(1).max(20).default(5),
    model: z.string().optional(),
    useReasoning: z.boolean().default(false),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = bodySchema.safeParse(body);

        if (!result.success) {
            console.warn('[Pipeline/Generate] Validation failed:', result.error.issues);
            return NextResponse.json(
                { error: 'Invalid request body', issues: result.error.issues },
                { status: 400 }
            );
        }

        const { archetypeId, type, band, count, model, useReasoning } = result.data;

        const maxAttempts = 2;
        let attempt = 0;
        let lastError: any = null;

        while (attempt < maxAttempts) {
            attempt++;
            try {
                // 1. Build Prompt
                const prompt = await buildPrompt({ archetypeId, type, band, count });

                // 2. Generate Content
                const { content, usage } = await generateContent({
                    prompt,
                    model,
                    includeReasoning: useReasoning
                });

                // 3. Validate
                const batch = parseAndValidateAiBatch(content);

                // 4. Persistence
                const { insertedCount } = await insertGeneratedProblems(batch.problems, archetypeId);

                return NextResponse.json({
                    success: true,
                    insertedCount,
                    usage,
                    attempt,
                });
            } catch (err: any) {
                lastError = err;

                // Only retry on JSON parse errors
                if (err instanceof AiBatchError && err.stage === 'json_parse' && attempt < maxAttempts) {
                    console.warn(`[Pipeline/Generate] JSON parse failed on attempt ${attempt}. Retrying...`);
                    continue;
                }

                // Break on any other error
                break;
            }
        }

        // If we're here, all attempts failed
        if (lastError instanceof ZodError) {
            return NextResponse.json(
                { error: 'AI generated invalid schema', stage: 'validation', issues: lastError.issues },
                { status: 422 }
            );
        }

        if (lastError instanceof AiBatchError) {
            return NextResponse.json(
                { error: lastError.message, stage: lastError.stage },
                { status: lastError.stage === 'json_parse' ? 422 : 500 }
            );
        }

        return NextResponse.json(
            { error: lastError?.message || 'Internal server error', stage: 'unknown' },
            { status: 500 }
        );

    } catch (error: any) {
        console.error('[Pipeline/Generate] Fatal error:', error);
        return NextResponse.json(
            { error: 'Failed to process request', message: error.message },
            { status: 500 }
        );
    }
}
