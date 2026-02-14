export interface ArchetypeContext {
    archetype: {
        id: string;
        slug: string;
        title: string;
        summary: string | null;
        eloMin: number | null;
        eloMax: number | null;
    };
    domain: {
        id: string;
        slug: string;
        title: string;
        summary: string | null;
    } | null;
    subject: {
        id: string;
        slug: string;
        title: string;
        summary: string | null;
    } | null;
}

export type ProblemType = 'MCQ' | 'NUMERIC' | 'EXPRESSION' | 'OPEN';

export interface BuildPromptInput {
    archetypeId: string;
    type: ProblemType;
    band: string; // e.g. "400_600"
    count: number;
}

export interface BuildPromptInputWithContext extends BuildPromptInput {
    ctx: ArchetypeContext;
}
