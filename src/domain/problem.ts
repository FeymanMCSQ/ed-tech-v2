export type ProblemType = "MCQ" | "NUMERIC" | "EXPRESSION" | "OPEN";

export interface MCQChoice {
    id: string;
    content: string; // LaTeX supported
}

export interface ProblemView {
    id: string;
    type: ProblemType;
    promptLatex: string;
    choices: MCQChoice[];
    topic: string;
    tags: string[];
    rating: number;
    userRating?: number;
    attemptCount?: number;
    solutions?: string;
    subjectOrder?: number;
}

export function formatProblemView(problem: any, userRating?: number, attemptCount?: number): ProblemView {
    let choices: MCQChoice[] = [];

    if (problem.type === "MCQ" && problem.choices) {
        const rawChoices = problem.choices;

        if (typeof rawChoices === 'object' && !Array.isArray(rawChoices)) {
            choices = Object.entries(rawChoices).map(([id, val]: [string, any]) => {
                let content = "";
                if (typeof val === 'string') {
                    content = val;
                } else if (val && typeof val === 'object') {
                    content = val.content || val.latex || val.text || JSON.stringify(val);
                } else {
                    content = String(val);
                }
                return { id, content };
            });
        } else if (Array.isArray(rawChoices)) {
            choices = rawChoices.map((val: any, index: number) => {
                const id = String.fromCharCode(65 + index);
                let content = "";
                if (typeof val === 'string') {
                    content = val;
                } else if (val && typeof val === 'object') {
                    content = val.content || val.latex || val.text || JSON.stringify(val);
                } else {
                    content = String(val);
                }
                return { id, content };
            });
        }
    }
    return {
        id: problem.id,
        type: problem.type as ProblemType,
        promptLatex: problem.promptLatex,
        choices,
        topic: problem.topic,
        tags: problem.tags,
        rating: problem.rating,
        userRating,
        attemptCount,
        solutions: problem.solutions,
        subjectOrder: problem.Archetype?.Domain?.Subject?.order || 1
    };
}

/**
 * Maps a flat row from the raw SQL problem selection query to a ProblemView.
 * The row contains all fields inline (no nested Prisma relations).
 */
export function formatProblemViewFromRow(row: {
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
}): ProblemView {
    let choices: MCQChoice[] = [];

    if (row.type === "MCQ" && row.choices) {
        const rawChoices = row.choices;

        if (typeof rawChoices === 'object' && !Array.isArray(rawChoices)) {
            choices = Object.entries(rawChoices).map(([id, val]: [string, any]) => {
                let content = "";
                if (typeof val === 'string') {
                    content = val;
                } else if (val && typeof val === 'object') {
                    content = val.content || val.latex || val.text || JSON.stringify(val);
                } else {
                    content = String(val);
                }
                return { id, content };
            });
        } else if (Array.isArray(rawChoices)) {
            choices = rawChoices.map((val: any, index: number) => {
                const id = String.fromCharCode(65 + index);
                let content = "";
                if (typeof val === 'string') {
                    content = val;
                } else if (val && typeof val === 'object') {
                    content = val.content || val.latex || val.text || JSON.stringify(val);
                } else {
                    content = String(val);
                }
                return { id, content };
            });
        }
    }

    return {
        id: row.id,
        type: row.type as ProblemType,
        promptLatex: row.promptLatex,
        choices,
        topic: row.topic,
        tags: row.tags,
        rating: row.rating,
        userRating: row.userRating,
        attemptCount: row.attemptCount,
        solutions: row.solutions ?? undefined,
        subjectOrder: row.subjectOrder ?? 1
    };
}

/**
 * Calculates the mastery rating adjustment after a calibration attempt.
 * Implements a simplified ELO curve.
 */
export function calculateRatingDelta(
    userRating: number,
    problemRating: number,
    isCorrect: boolean
): number {
    const K = 32; // Base sensitivity
    const SENSITIVITY = 400; // ELO curve width

    // Expected probability of success based on rating difference
    const expected = 1 / (1 + Math.pow(10, (problemRating - userRating) / SENSITIVITY));
    const result = isCorrect ? 1 : 0;

    const delta = Math.round(K * (result - expected));

    // Clamp absolute change to [1, K] to ensure every attempt matters
    if (delta === 0) return isCorrect ? 1 : -1;

    return delta;
}
