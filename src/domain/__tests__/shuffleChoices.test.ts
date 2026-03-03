import { describe, it, expect } from 'vitest';
import { shuffleMcqChoices } from '../shuffleChoices';

/**
 * Seeded pseudo-random generator for deterministic tests.
 * Uses a simple linear congruential generator (LCG).
 * Per 08-testing-strategy.md §6: "Inject time and randomness."
 */
function createSeededRandom(seed: number): () => number {
    let state = seed;
    return (): number => {
        state = (state * 1664525 + 1013904223) % 2 ** 32;
        return (state >>> 0) / 2 ** 32;
    };
}

describe('shuffleMcqChoices', () => {
    const baseChoices = [
        { id: 'A' as const, latex: 'x^2' },
        { id: 'B' as const, latex: '2x' },
        { id: 'C' as const, latex: 'x+1' },
        { id: 'D' as const, latex: '\\frac{1}{x}' },
    ];

    it('returns exactly 4 choices with IDs A, B, C, D', () => {
        const random = createSeededRandom(42);
        const result = shuffleMcqChoices(baseChoices, 'A', random);
        expect(result.choices).toHaveLength(4);
        const ids = result.choices.map((c) => c.id).sort();
        expect(ids).toEqual(['A', 'B', 'C', 'D']);
    });

    it('preserves all latex values', () => {
        const random = createSeededRandom(123);
        const result = shuffleMcqChoices(baseChoices, 'A', random);
        const originalLatex = baseChoices.map((c) => c.latex).sort();
        const shuffledLatex = result.choices.map((c) => c.latex).sort();
        expect(shuffledLatex).toEqual(originalLatex);
    });

    it('correctly tracks the correct answer through the shuffle', () => {
        // Use multiple seeds for coverage, each deterministic
        for (let seed = 0; seed < 50; seed++) {
            const random = createSeededRandom(seed);
            const result = shuffleMcqChoices(baseChoices, 'A', random);
            const correctItem = result.choices.find((c) => c.id === result.correctChoice);
            expect(correctItem).toBeDefined();
            expect(correctItem!.latex).toBe('x^2'); // original A's latex
        }
    });

    it('tracks correctChoice for non-A original answers', () => {
        for (let seed = 0; seed < 50; seed++) {
            const random = createSeededRandom(seed);
            const result = shuffleMcqChoices(baseChoices, 'C', random);
            const correctItem = result.choices.find((c) => c.id === result.correctChoice);
            expect(correctItem).toBeDefined();
            expect(correctItem!.latex).toBe('x+1'); // original C's latex
        }
    });

    it('produces a deterministic result given the same seed', () => {
        const result1 = shuffleMcqChoices(baseChoices, 'A', createSeededRandom(999));
        const result2 = shuffleMcqChoices(baseChoices, 'A', createSeededRandom(999));
        expect(result1).toEqual(result2);
    });

    it('distributes correct answer across positions over varied seeds', () => {
        const positionCounts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };

        for (let seed = 0; seed < 1000; seed++) {
            const random = createSeededRandom(seed);
            const result = shuffleMcqChoices(baseChoices, 'A', random);
            positionCounts[result.correctChoice]++;
        }

        // Each position should appear at least once in 1000 runs
        expect(positionCounts['A']).toBeGreaterThan(0);
        expect(positionCounts['B']).toBeGreaterThan(0);
        expect(positionCounts['C']).toBeGreaterThan(0);
        expect(positionCounts['D']).toBeGreaterThan(0);
    });

    it('throws if choices array is not length 4', () => {
        const bad = baseChoices.slice(0, 3);
        const random = createSeededRandom(1);
        expect(() => shuffleMcqChoices(bad, 'A', random)).toThrow('expected 4 choices');
    });

    it('throws if correctChoice ID is not found', () => {
        const random = createSeededRandom(1);
        expect(() =>
            shuffleMcqChoices(baseChoices, 'X' as any, random)
        ).toThrow('not found in choices');
    });
});
