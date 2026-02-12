import { NextResponse } from "next/server";
import db from "@/data/db";
import { SubjectIngestionSchema } from "@/domain/pipeline";
import { crypto } from "next/dist/compiled/@edge-runtime/primitives";

export async function POST(request: Request) {
    try {
        // 1. Explicit JSON Parse Check
        let body;
        try {
            body = await request.json();
        } catch (e: any) {
            return NextResponse.json({
                success: false,
                error: {
                    code: "SYNTAX_ERROR",
                    message: "Invalid JSON format: " + e.message
                }
            }, { status: 400 });
        }

        // 2. Schema Validation (includes internal duplicate check)
        const result = SubjectIngestionSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({
                success: false,
                error: {
                    code: "VALIDATION_ERROR",
                    message: "Invalid subject data",
                    details: result.error.format()
                }
            }, { status: 400 });
        }

        const subjects = result.data;

        // 3. Database Conflict Check (Subject already exists)
        const existingSlugs = await db.subject.findMany({
            where: { slug: { in: subjects.map(s => s.slug) } },
            select: { slug: true }
        });

        if (existingSlugs.length > 0) {
            return NextResponse.json({
                success: false,
                error: {
                    code: "CONFLICT",
                    message: "One or more subjects already exist",
                    details: {
                        existing: existingSlugs.map(s => s.slug)
                    }
                }
            }, { status: 409 });
        }

        // 4. Persistence with Error Catching
        try {
            const results = await db.$transaction(
                subjects.map(subject => db.subject.create({
                    data: {
                        id: crypto.randomUUID(),
                        slug: subject.slug,
                        title: subject.title,
                        order: subject.order,
                        summary: subject.summary || null,
                        updatedAt: new Date(),
                    }
                }))
            );

            return NextResponse.json({
                success: true,
                data: {
                    count: results.length,
                    subjects: results.map(s => ({ slug: s.slug, title: s.title }))
                }
            });
        } catch (dbError: any) {
            console.error("Prisma Refusal:", dbError);
            return NextResponse.json({
                success: false,
                error: {
                    code: "DATABASE_REFUSAL",
                    message: "The database refused to seed the records.",
                    details: dbError.message
                }
            }, { status: 500 });
        }

    } catch (error: any) {
        console.error("Unexpected Pipeline Error:", error);
        return NextResponse.json({
            success: false,
            error: {
                code: "INTERNAL_ERROR",
                message: "An unexpected error occurred during ingestion."
            }
        }, { status: 500 });
    }
}
