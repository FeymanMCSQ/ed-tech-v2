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
}

export function formatProblemView(problem: any, userRating?: number): ProblemView {
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
        userRating
    };
}
