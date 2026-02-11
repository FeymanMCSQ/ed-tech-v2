import type { Subject } from "@/prisma";

export interface World {
    id: string;
    slug: string;
    title: string;
    summary: string | null;
    rating?: number;
    tier?: string;
    isEnrolled: boolean;
    order: number;
}

export interface DomainView {
    id: string;
    slug: string;
    title: string;
    summary: string | null;
    archetypeCount: number;
    enrolledCount: number;
    rating?: number;
    isEnrolled: boolean;
    order: number;
}

export interface WorldDetail {
    id: string;
    slug: string;
    title: string;
    summary: string | null;
    domains: DomainView[];
}

export interface ArchetypeView {
    id: string;
    slug: string;
    title: string;
    summary: string | null;
    rating: number; // For enrolled users, this will be their current rating (e.g. 200)
    tier: WorldTier;
}

export interface DomainDetail {
    id: string;
    slug: string;
    title: string;
    summary: string | null;
    rating?: number;
    isEnrolled: boolean;
    archetypes: ArchetypeView[];
}

export type WorldTier = "NOVICE" | "ADEPT" | "EXPERT" | "MASTER" | "ARCHMAGE";

export function calculateTier(rating: number): WorldTier {
    if (rating < 800) return "NOVICE";
    if (rating < 1400) return "ADEPT";
    if (rating < 1700) return "EXPERT";
    if (rating < 2000) return "MASTER";
    return "ARCHMAGE";
}

export function formatWorlds(
    subjects: Subject[],
    userArchetypes: {
        rating: number;
        Archetype: {
            Domain: {
                subjectId: string;
            };
        };
    }[]
): { enrolled: World[]; available: World[] } {
    const enrolledWorlds: World[] = [];
    const availableWorlds: World[] = [];

    // Map subjectId to its highest rating in any of its archetypes
    const subjectRatings = new Map<string, number>();
    userArchetypes.forEach((ua) => {
        const subjectId = ua.Archetype.Domain.subjectId;
        const current = subjectRatings.get(subjectId) || 0;
        if (ua.rating > current) {
            subjectRatings.set(subjectId, ua.rating);
        }
    });

    subjects.forEach((subject) => {
        const rating = subjectRatings.get(subject.id);
        const world: World = {
            id: subject.id,
            slug: subject.slug,
            title: subject.title,
            summary: subject.summary,
            rating: rating,
            tier: rating !== undefined ? calculateTier(rating) : undefined,
            isEnrolled: rating !== undefined,
            order: subject.order,
        };

        if (world.isEnrolled) {
            enrolledWorlds.push(world);
        } else {
            availableWorlds.push(world);
        }
    });

    return {
        enrolled: enrolledWorlds.sort((a, b) => (b.rating || 0) - (a.rating || 0)),
        available: availableWorlds.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title)),
    };
}

export function formatWorldDetail(
    subject: any, // Subject with Domains & Archetypes
    userArchetypes: any[]
): WorldDetail {
    // Map archetypeId to user's rating
    const userRatings = new Map<string, number>();
    userArchetypes.forEach(ua => userRatings.set(ua.archetypeId, ua.rating));

    const domains: DomainView[] = subject.Domain.map((domain: any) => {
        const archetypes = domain.Archetype || [];
        const archetypeCount = archetypes.length;

        // Count how many archetypes the user has initialized in this domain
        let enrolledCount = 0;
        let totalRating = 0;
        let maxRating = 0;

        archetypes.forEach((arch: any) => {
            if (userRatings.has(arch.id)) {
                enrolledCount++;
                const rating = userRatings.get(arch.id)!;
                totalRating += rating;
                if (rating > maxRating) maxRating = rating;
            }
        });

        // A domain is "enrolled" if at least one archetype is initialized
        const isEnrolled = enrolledCount > 0;

        return {
            id: domain.id,
            slug: domain.slug,
            title: domain.title,
            summary: domain.summary,
            archetypeCount,
            enrolledCount,
            rating: isEnrolled ? maxRating : undefined,
            isEnrolled,
            order: domain.order
        };
    });

    return {
        id: subject.id,
        slug: subject.slug,
        title: subject.title,
        summary: subject.summary,
        domains: domains.sort((a, b) => a.order - b.order)
    };
}

export function formatDomainDetail(
    domain: any, // Domain with Archetypes
    userArchetypes: any[]
): DomainDetail {
    const userRatings = new Map<string, number>();
    userArchetypes.forEach(ua => userRatings.set(ua.archetypeId, ua.rating));

    const archetypes: ArchetypeView[] = domain.Archetype.map((arch: any) => {
        const rating = userRatings.get(arch.id) || 0;
        return {
            id: arch.id,
            slug: arch.slug,
            title: arch.title,
            summary: arch.summary,
            rating,
            tier: calculateTier(rating)
        };
    });

    const isEnrolled = archetypes.some(a => a.rating > 0);
    let maxRating = 0;
    if (isEnrolled) {
        maxRating = Math.max(...archetypes.map(a => a.rating));
    }

    return {
        id: domain.id,
        slug: domain.slug,
        title: domain.title,
        summary: domain.summary,
        isEnrolled,
        rating: isEnrolled ? maxRating : undefined,
        archetypes: archetypes.sort((a, b) => (domain.Archetype.find((oa: any) => oa.id === a.id)?.order || 0) - (domain.Archetype.find((oa: any) => oa.id === b.id)?.order || 0))
    };
}
