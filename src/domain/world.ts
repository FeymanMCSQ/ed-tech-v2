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
