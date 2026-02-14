import db from '@/data/db';
import type {
    BuildPromptInput,
    BuildPromptInputWithContext,
    ArchetypeContext,
} from './types';
import { buildMcqPrompt } from './templates/mcq';

async function loadArchetypeContext(
    archetypeId: string
): Promise<ArchetypeContext> {
    const archetype = await db.archetype.findUnique({
        where: { id: archetypeId },
        select: {
            id: true,
            slug: true,
            title: true,
            summary: true,
            eloMin: true,
            eloMax: true,
            Domain: {
                select: {
                    id: true,
                    slug: true,
                    title: true,
                    summary: true,
                    Subject: {
                        select: {
                            id: true,
                            slug: true,
                            title: true,
                            summary: true,
                        },
                    },
                },
            },
        },
    });

    if (!archetype) {
        throw new Error(`buildPrompt: Archetype not found (id=${archetypeId})`);
    }

    return {
        archetype: {
            id: archetype.id,
            slug: archetype.slug,
            title: archetype.title,
            summary: archetype.summary ?? null,
            eloMin: archetype.eloMin ?? null,
            eloMax: archetype.eloMax ?? null,
        },
        domain: archetype.Domain
            ? {
                id: archetype.Domain.id,
                slug: archetype.Domain.slug,
                title: archetype.Domain.title,
                summary: archetype.Domain.summary ?? null,
            }
            : null,
        subject: archetype.Domain?.Subject
            ? {
                id: archetype.Domain.Subject.id,
                slug: archetype.Domain.Subject.slug,
                title: archetype.Domain.Subject.title,
                summary: archetype.Domain.Subject.summary ?? null,
            }
            : null,
    };
}

export async function buildPrompt(input: BuildPromptInput): Promise<string> {
    const ctx = await loadArchetypeContext(input.archetypeId);

    const enriched: BuildPromptInputWithContext = {
        ...input,
        ctx,
    };

    switch (enriched.type) {
        case 'MCQ':
            return buildMcqPrompt(enriched);
        case 'NUMERIC':
            // Fallback or placeholder for Stage 1
            throw new Error('Numeric prompt builder not yet implemented');
        case 'EXPRESSION':
            throw new Error('Expression prompt builder not yet implemented');
        case 'OPEN':
            throw new Error('Open prompt builder not yet implemented');
        default: {
            const _never: never = enriched.type;
            return _never;
        }
    }
}
