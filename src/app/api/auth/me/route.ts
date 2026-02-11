import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import db from "@/data/db";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get("auth-user-id")?.value;

        if (!userId) {
            return NextResponse.json(
                { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
                { status: 401 }
            );
        }

        const user = await db.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                displayName: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                { success: false, error: { code: "USER_NOT_FOUND", message: "User session invalid" } },
                { status: 401 }
            );
        }

        return NextResponse.json({
            success: true,
            data: user,
        });
    } catch (error) {
        console.error("Session fetch error:", error);
        return NextResponse.json(
            { success: false, error: { code: "INTERNAL_ERROR", message: "Internal server error" } },
            { status: 500 }
        );
    }
}
