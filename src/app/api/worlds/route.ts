import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import db from "@/data/db";
import { formatWorlds } from "@/domain/world";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        let userId = searchParams.get("userId");

        // Fallback to cookie
        if (!userId) {
            const cookieStore = await cookies();
            userId = cookieStore.get("auth-user-id")?.value || null;
        }

        // Fetch all potential worlds (Subjects)
        const subjects = await db.subject.findMany({
            orderBy: { order: "asc" },
        });

        // Fetch user progress if userId is provided
        let userArchetypes: any[] = [];
        if (userId) {
            userArchetypes = await db.userArchetype.findMany({
                where: { userId },
                include: {
                    Archetype: {
                        include: {
                            Domain: {
                                select: { subjectId: true }
                            }
                        }
                    }
                }
            });
        }

        const formatted = formatWorlds(subjects, userArchetypes);

        return NextResponse.json({
            success: true,
            data: formatted
        });
    } catch (error) {
        console.error("Failed to fetch worlds:", error);
        return NextResponse.json(
            { success: false, error: { code: "INTERNAL_ERROR", message: "Failed to fetch worlds" } },
            { status: 500 }
        );
    }
}
