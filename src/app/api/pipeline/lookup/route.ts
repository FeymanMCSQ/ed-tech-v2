import { NextResponse } from "next/server";
import db from "@/data/db";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const query = searchParams.get("query") || "";

    if (!type || !["subject", "domain", "archetype", "user"].includes(type)) {
        return NextResponse.json({
            success: false,
            error: {
                code: "VALIDATION_ERROR",
                message: "Valid type (subject, domain, or archetype) is required"
            }
        }, { status: 400 });
    }

    try {
        let results: { id: string, title: string }[] = [];

        if (type === "subject") {
            results = await db.subject.findMany({
                where: {
                    title: {
                        contains: query,
                        mode: "insensitive"
                    }
                },
                select: { id: true, title: true },
                take: 20
            });
        } else if (type === "domain") {
            results = await db.domain.findMany({
                where: {
                    title: {
                        contains: query,
                        mode: "insensitive"
                    }
                },
                select: { id: true, title: true },
                take: 20
            });
        } else if (type === "archetype") {
            results = await db.archetype.findMany({
                where: {
                    title: {
                        contains: query,
                        mode: "insensitive"
                    }
                },
                select: { id: true, title: true, slug: true },
                take: 20
            });
        } else if (type === "user") {
            const users = await db.user.findMany({
                where: {
                    email: {
                        contains: query,
                        mode: "insensitive"
                    }
                },
                select: { id: true, email: true },
                take: 20
            });
            // Map email to title for UI consistency
            results = users.map(u => ({ id: u.id, title: u.email || "No Email" }));
        }

        return NextResponse.json({
            success: true,
            data: results
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: {
                code: "INTERNAL_ERROR",
                message: error.message || "An unexpected error occurred during lookup"
            }
        }, { status: 500 });
    }
}
