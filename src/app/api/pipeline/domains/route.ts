import { NextResponse } from "next/server";
import db from "@/data/db";
import { DomainIngestionSchema } from "@/domain/pipeline";
import { Prisma } from "@/prisma";
import { nanoid } from "nanoid";

export async function POST(request: Request) {
    try {
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

        const { subjectId, domains: domainsRaw } = body;

        if (!subjectId) {
            return NextResponse.json({
                success: false,
                error: {
                    code: "VALIDATION_ERROR",
                    message: "subjectId is required"
                }
            }, { status: 400 });
        }

        const subject = await db.subject.findUnique({
            where: { id: subjectId }
        });

        if (!subject) {
            return NextResponse.json({
                success: false,
                error: {
                    code: "NOT_FOUND",
                    message: `Subject with ID "${subjectId}" not found`
                }
            }, { status: 404 });
        }

        const result = DomainIngestionSchema.safeParse(domainsRaw);

        if (!result.success) {
            return NextResponse.json({
                success: false,
                error: {
                    code: "VALIDATION_ERROR",
                    message: "Domain validation failed",
                    details: result.error.format()
                }
            }, { status: 400 });
        }

        const domains = result.data;

        const count = await db.$transaction(async (tx) => {
            let createdCount = 0;
            for (const domain of domains) {
                // Check if domain exists to preserve "Strict Seeding" invariant
                const existing = await tx.domain.findUnique({
                    where: { slug: domain.slug }
                });

                if (existing) {
                    throw new Error(`CONFLICT: Domain slug "${domain.slug}" already exists`);
                }

                await tx.domain.create({
                    data: {
                        id: `dom_${nanoid(10)}`,
                        slug: domain.slug,
                        title: domain.title,
                        order: domain.order,
                        summary: domain.summary,
                        subjectId: subjectId
                    }
                });
                createdCount++;
            }
            return createdCount;
        });

        return NextResponse.json({
            success: true,
            data: { count }
        });

    } catch (error: any) {
        if (error.message.startsWith("CONFLICT:")) {
            return NextResponse.json({
                success: false,
                error: {
                    code: "CONFLICT",
                    message: error.message.replace("CONFLICT: ", "")
                }
            }, { status: 409 });
        }

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return NextResponse.json({
                    success: false,
                    error: {
                        code: "CONFLICT",
                        message: "A database constraint violation occurred (likely a duplicate slug)",
                        details: error.meta
                    }
                }, { status: 409 });
            }
        }

        return NextResponse.json({
            success: false,
            error: {
                code: "INTERNAL_ERROR",
                message: error.message || "An unexpected error occurred"
            }
        }, { status: 500 });
    }
}
