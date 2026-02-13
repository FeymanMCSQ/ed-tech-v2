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
