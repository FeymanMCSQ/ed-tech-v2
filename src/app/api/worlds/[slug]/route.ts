import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import db from "@/data/db";
import { formatWorldDetail } from "@/domain/world";

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    try {
        const { slug } = await params;

        // Fetch subject with nested domains and archetypes
        const subject = await db.subject.findUnique({
            where: { slug },
            include: {
                Domain: {
                    include: {
                        Archetype: true
                    }
                }
            }
        });

        if (!subject) {
            return NextResponse.json(
                { success: false, error: { code: "NOT_FOUND", message: "Realm not found" } },
                { status: 404 }
            );
        }

        // Fetch user progress if authenticated
        const cookieStore = await cookies();
        const userId = cookieStore.get("auth-user-id")?.value;

        let userArchetypes: any[] = [];
        if (userId) {
            // Fetch all user archetypes that belong to this subject's domains
            userArchetypes = await db.userArchetype.findMany({
                where: {
                    userId,
                    Archetype: {
                        Domain: {
                            subjectId: subject.id
                        }
                    }
                }
            });
        }

        const formatted = formatWorldDetail(subject, userArchetypes);

        return NextResponse.json({
            success: true,
            data: formatted
        });
    } catch (error) {
        console.error("Failed to fetch realm details:", error);
        return NextResponse.json(
            { success: false, error: { code: "INTERNAL_ERROR", message: "Failed to fetch realm details" } },
            { status: 500 }
        );
    }
}
