import { NextResponse } from "next/server";
import db from "@/data/db";
import { ArchetypeIngestionSchema } from "@/domain/pipeline";
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

        const { domainId, archetypes: archetypesRaw } = body;

        if (!domainId) {
            return NextResponse.json({
                success: false,
                error: {
                    code: "VALIDATION_ERROR",
                    message: "domainId is required"
                }
            }, { status: 400 });
        }

        const domainRecord = await db.domain.findUnique({
            where: { id: domainId }
        });

        if (!domainRecord) {
            return NextResponse.json({
                success: false,
                error: {
                    code: "NOT_FOUND",
                    message: `Domain with ID "${domainId}" not found`
                }
            }, { status: 404 });
        }

        const result = ArchetypeIngestionSchema.safeParse(archetypesRaw);

        if (!result.success) {
            return NextResponse.json({
                success: false,
                error: {
                    code: "VALIDATION_ERROR",
                    message: "Archetype validation failed",
                    details: result.error.format()
                }
            }, { status: 400 });
        }

        const archetypes = result.data;

        const count = await db.$transaction(async (tx) => {
            let createdCount = 0;
            for (const arch of archetypes) {
                // Check if slug exists
                const existingSlug = await tx.archetype.findUnique({
                    where: { slug: arch.slug }
                });

                if (existingSlug) {
                    throw new Error(`CONFLICT: Archetype slug "${arch.slug}" already exists`);
                }

                // Check [stream, order] unique constraint if stream is provided
                if (arch.stream) {
                    const existingOrder = await tx.archetype.findUnique({
                        where: {
                            stream_order: {
                                stream: arch.stream,
                                order: arch.order
                            }
                        }
                    });

                    if (existingOrder) {
                        throw new Error(`CONFLICT: Archetype with stream "${arch.stream}" and order "${arch.order}" already exists`);
                    }
                }

                await tx.archetype.create({
                    data: {
                        id: `arch_${nanoid(10)}`,
                        slug: arch.slug,
                        title: arch.title,
                        stream: arch.stream || null,
                        order: arch.order,
                        summary: arch.summary,
                        eloMin: arch.eloMin,
                        eloMax: arch.eloMax,
                        domainId: domainId
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
                        message: "A database constraint violation occurred (likely a duplicate slug or stream/order pair)",
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
