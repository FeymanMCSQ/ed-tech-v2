/**
 * Post-generation MCQ choice shuffler.
 *
 * Eliminates LLM answer-position bias by performing a Fisher-Yates shuffle
 * on the choices array and reassigning IDs A–D in the new order.
 *
 * This is a pure domain function with no infrastructure dependencies.
 */

type ChoiceId = 'A' | 'B' | 'C' | 'D';

interface Choice {
    id: ChoiceId;
    latex: string;
}

const CHOICE_IDS: readonly ChoiceId[] = ['A', 'B', 'C', 'D'] as const;

export interface ShuffleResult {
    choices: Choice[];
    correctChoice: ChoiceId;
}

/**
 * Shuffles an MCQ choices array and returns the updated correctChoice.
 *
 * @param choices - Exactly 4 MCQ choice objects with ids A–D
 * @param correctChoice - The current correct choice id
 * @returns New choices array (shuffled, re-IDed A–D) and updated correctChoice
 */
export function shuffleMcqChoices(
    choices: Choice[],
    correctChoice: ChoiceId,
    random: () => number = Math.random
): ShuffleResult {
    if (choices.length !== 4) {
        throw new Error(`shuffleMcqChoices: expected 4 choices, got ${choices.length}`);
    }

    // Find the latex of the correct answer before we shuffle
    const correctLatex = choices.find((c) => c.id === correctChoice)?.latex;
    if (correctLatex === undefined) {
        throw new Error(`shuffleMcqChoices: correctChoice "${correctChoice}" not found in choices`);
    }

    // Copy latex values only (we will reassign IDs after shuffle)
    const latexValues = choices.map((c) => c.latex);

    // Fisher-Yates shuffle using injected random source (deterministic core rule, doc §6)
    for (let i = latexValues.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [latexValues[i], latexValues[j]] = [latexValues[j], latexValues[i]];
    }

    // Rebuild choices with new IDs
    const shuffled: Choice[] = latexValues.map((latex, index) => ({
        id: CHOICE_IDS[index],
        latex,
    }));

    // Find the new ID of the correct answer
    const newCorrectChoice = shuffled.find((c) => c.latex === correctLatex)!.id;

    return {
        choices: shuffled,
        correctChoice: newCorrectChoice,
    };
}
