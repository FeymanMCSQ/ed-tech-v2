import { NextResponse } from "next/server";
import db from "@/data/db";
import { RegisterSchema, hashPassword } from "@/domain/auth";
import { randomUUID } from "node:crypto";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validated = RegisterSchema.safeParse(body);

        if (!validated.success) {
            const firstError = validated.error.issues[0]?.message || "Invalid input";
            return NextResponse.json(
                { success: false, error: { code: "VALIDATION_ERROR", message: firstError } },
                { status: 400 }
            );
        }

        const { email, password, displayName } = validated.data;

        // Check if user exists
        const existingUser = await db.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { success: false, error: { code: "CONFLICT", message: "This email is already registered" } },
                { status: 409 }
            );
        }

        const passwordHash = await hashPassword(password);

        const user = await db.user.create({
            data: {
                id: randomUUID(),
                email,
                passwordHash,
                displayName,
            },
        });

        return NextResponse.json(
            { success: true, data: { userId: user.id, email: user.email } },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { success: false, error: { code: "INTERNAL_ERROR", message: "Internal server error" } },
            { status: 500 }
        );
    }
}
