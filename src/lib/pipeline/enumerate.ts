import {
    fetchSubjectCounts,
    fetchDomainCounts,
    fetchArchetypeCounts,
    EnumerationResult
} from '../db/enumeration';

export type EnumerationLevel = 'SUBJECT' | 'DOMAIN' | 'ARCHETYPE';

export interface EnumerateInput {
    level: EnumerationLevel;
    query: string;
}

/**
 * Domain service for enumerating problem counts across the educational hierarchy.
 * Adheres to strict architectural separation: does not import Prisma directly.
 */
export async function enumerateProblems(input: EnumerateInput): Promise<EnumerationResult[]> {
    const { level, query } = input;

    // Normalize query
    const cleanQuery = query.trim();

    switch (level) {
        case 'SUBJECT':
            return fetchSubjectCounts(cleanQuery);
        case 'DOMAIN':
            return fetchDomainCounts(cleanQuery);
        case 'ARCHETYPE':
            return fetchArchetypeCounts(cleanQuery);
        default:
            throw new Error(`Invalid enumeration level: ${level}`);
    }
}
