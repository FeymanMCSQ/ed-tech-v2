import db from '@/data/db';

export interface EnumerationResult {
    id: string;
    title: string;
    count: number;
}

export async function fetchSubjectCounts(query: string): Promise<EnumerationResult[]> {
    const subjects = await db.subject.findMany({
        where: {
            title: { contains: query, mode: 'insensitive' }
        },
        select: {
            id: true,
            title: true,
            Domain: {
                select: {
                    Archetype: {
                        select: {
                            _count: {
                                select: { Problem: true }
                            }
                        }
                    }
                }
            }
        },
        take: 20,
    });

    return subjects.map(s => {
        let total = 0;
        s.Domain.forEach(d => {
            d.Archetype.forEach(a => {
                total += a._count.Problem;
            });
        });
        return { id: s.id, title: s.title, count: total };
    });
}

export async function fetchDomainCounts(query: string): Promise<EnumerationResult[]> {
    const domains = await db.domain.findMany({
        where: {
            title: { contains: query, mode: 'insensitive' }
        },
        select: {
            id: true,
            title: true,
            Archetype: {
                select: {
                    _count: {
                        select: { Problem: true }
                    }
                }
            }
        },
        take: 20,
    });

    return domains.map(d => {
        let total = 0;
        d.Archetype.forEach(a => {
            total += a._count.Problem;
        });
        return { id: d.id, title: d.title, count: total };
    });
}

export async function fetchArchetypeCounts(query: string): Promise<EnumerationResult[]> {
    const archetypes = await db.archetype.findMany({
        where: {
            title: { contains: query, mode: 'insensitive' }
        },
        select: {
            id: true,
            title: true,
            _count: {
                select: { Problem: true }
            }
        },
        take: 20,
    });

    return archetypes.map(a => ({
        id: a.id,
        title: a.title,
        count: a._count.Problem
    }));
}
