import { Prisma, ProblemType } from '@/prisma';
import db from '@/data/db';
import type { GeneratedProblem } from '../../schema/problemSchema';
import { nanoid } from 'nanoid';

/**
 * Maps a GeneratedProblem (validated by Zod) into the Shape Prisma expects for createMany.
 */
function toCreateInput(
    problem: GeneratedProblem,
    archetypeId: string
): Prisma.ProblemCreateManyInput {
    const base: Prisma.ProblemCreateManyInput = {
        id: nanoid(),
        promptLatex: problem.promptLatex,
        seedRating: problem.seedRating,
        rating: problem.rating,
        topic: problem.topic,
        tags: problem.tags,
        solutions: problem.solutions ?? null,
        type: (problem.type as ProblemType | undefined) ?? ProblemType.MCQ,
        requireForm: problem.requireForm ?? [],
        archetypeId: archetypeId,
    };

    if (base.type === ProblemType.MCQ) {
        return {
            ...base,
            choices: (problem.choices as Prisma.InputJsonValue) ?? Prisma.JsonNull,
            correctChoice: problem.correctChoice ?? null,
            correctNumeric: Prisma.JsonNull,
            correctExpr: Prisma.JsonNull,
        };
    }

    if (base.type === ProblemType.NUMERIC) {
        return {
            ...base,
            choices: Prisma.JsonNull,
            correctChoice: null,
            correctNumeric: (problem.correctNumeric as Prisma.InputJsonValue) ?? Prisma.JsonNull,
            correctExpr: Prisma.JsonNull,
        };
    }

    if (base.type === ProblemType.EXPRESSION) {
        return {
            ...base,
            choices: Prisma.JsonNull,
            correctChoice: null,
            correctNumeric: Prisma.JsonNull,
            correctExpr: (problem.correctExpr as Prisma.InputJsonValue) ?? Prisma.JsonNull,
        };
    }

    return base;
}

/**
 * Inserts a batch of generated problems into the database.
 */
export async function insertGeneratedProblems(
    problems: GeneratedProblem[],
    archetypeId: string
): Promise<{ insertedCount: number }> {
    if (problems.length === 0) {
        return { insertedCount: 0 };
    }

    const data = problems.map((p) => toCreateInput(p, archetypeId));

    const result = await db.problem.createMany({
        data,
        skipDuplicates: false,
    });

    return { insertedCount: result.count };
}
