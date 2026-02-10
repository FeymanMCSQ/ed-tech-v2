import { NextResponse } from "next/server";
import db from "@/data/db";
import { LoginSchema, verifyPassword } from "@/domain/auth";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validated = LoginSchema.safeParse(body);

        if (!validated.success) {
            const firstError = validated.error.issues[0]?.message || "Invalid input";
            return NextResponse.json(
                { success: false, error: { code: "VALIDATION_ERROR", message: firstError } },
                { status: 400 }
            );
        }

        const { email, password } = validated.data;

        const user = await db.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { success: false, error: { code: "USER_NOT_FOUND", message: "User not found" } },
                { status: 401 }
            );
        }

        if (!user.passwordHash) {
            return NextResponse.json(
                { success: false, error: { code: "MISSING_PASSWORD_HASH", message: "User has no password hash set" } },
                { status: 401 }
            );
        }

        const isValid = await verifyPassword(password, user.passwordHash);

        if (!isValid) {
            return NextResponse.json(
                { success: false, error: { code: "INVALID_PASSWORD", message: "Invalid password" } },
                { status: 401 }
            );
        }

        // In a real app, we would set a session cookie here.
        // For this test, we just return success.
        return NextResponse.json(
            { success: true, data: { userId: user.id, email: user.email, displayName: user.displayName } },
            { status: 200 }
        );
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { success: false, error: { code: "INTERNAL_ERROR", message: "Internal server error" } },
            { status: 500 }
        );
    }
}
