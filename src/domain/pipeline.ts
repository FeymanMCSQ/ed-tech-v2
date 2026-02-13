import { z } from "zod";

/**
 * Schema for a single subject being ingested.
 */
export const SubjectSchema = z.object({
    slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
    title: z.string().min(1, "Title is required"),
    order: z.number().int().default(1),
    summary: z.string().nullable().optional(),
});

/**
 * Schema for the bulk subject ingestion payload.
 * Also checks for duplicate slugs within the payload.
 */
export const SubjectIngestionSchema = z.array(SubjectSchema).refine((subjects) => {
    const slugs = subjects.map(s => s.slug);
    return new Set(slugs).size === slugs.length;
}, {
    message: "Duplicate slugs detected in the input array",
    path: []
});

export type SubjectIngestionInput = z.infer<typeof SubjectIngestionSchema>;

/**
 * Schema for a single domain being ingested.
 */
export const DomainSchema = z.object({
    slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
    title: z.string().min(1, "Title is required"),
    order: z.number().int().default(1),
    summary: z.string().nullable().optional(),
});

/**
 * Schema for the bulk domain ingestion payload.
 */
export const DomainIngestionSchema = z.array(DomainSchema).refine((domains) => {
    const slugs = domains.map(d => d.slug);
    return new Set(slugs).size === slugs.length;
}, {
    message: "Duplicate slugs detected in the input array",
    path: []
});

export type DomainIngestionInput = z.infer<typeof DomainIngestionSchema>;

/**
 * Schema for a single archetype being ingested.
 */
export const ArchetypeSchema = z.object({
    slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
    title: z.string().min(1, "Title is required"),
    stream: z.enum(["VC", "CA"]).nullable().optional(),
    order: z.number().int(),
    summary: z.string().nullable().optional(),
    eloMax: z.number().int().default(1900),
    eloMin: z.number().int().default(200),
});

/**
 * Schema for the bulk archetype ingestion payload.
 */
export const ArchetypeIngestionSchema = z.array(ArchetypeSchema)
    .refine((archetypes) => {
        const slugs = archetypes.map(a => a.slug);
        return new Set(slugs).size === slugs.length;
    }, {
        message: "Duplicate slugs detected in the input array",
        path: []
    })
    .refine((archetypes) => {
        const pairs = archetypes.map(a => `${a.stream}-${a.order}`);
        return new Set(pairs).size === pairs.length;
    }, {
        message: "Duplicate [stream, order] pairs detected in the input array",
        path: []
    });

export type ArchetypeIngestionInput = z.infer<typeof ArchetypeIngestionSchema>;
