import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import db from "@/data/db";
import { formatDomainDetail } from "@/domain/world";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string; domainSlug: string }> }
) {
    try {
        const { slug, domainSlug } = await params;

        // Fetch domain with nested archetypes
        const domain = await db.domain.findUnique({
            where: { slug: domainSlug },
            include: {
                Archetype: {
                    orderBy: { order: 'asc' }
                },
                Subject: {
                    select: { slug: true, order: true }
                }
            }
        });

        if (!domain || domain.Subject.slug !== slug) {
            return NextResponse.json(
                { success: false, error: { code: "NOT_FOUND", message: "Domain not found in this realm" } },
                { status: 404 }
            );
        }

        // Fetch user progress if authenticated
        const cookieStore = await cookies();
        const userId = cookieStore.get("auth-user-id")?.value;

        let userArchetypes: any[] = [];
        if (userId) {
            userArchetypes = await db.userArchetype.findMany({
                where: {
                    userId,
                    Archetype: {
                        domainId: domain.id
                    }
                }
            });
        }

        const formatted = formatDomainDetail(domain, userArchetypes);

        return NextResponse.json({
            success: true,
            data: formatted
        });
    } catch (error) {
        console.error("Failed to fetch domain details:", error);
        return NextResponse.json(
            { success: false, error: { code: "INTERNAL_ERROR", message: "Failed to fetch domain details" } },
            { status: 500 }
        );
    }
}
