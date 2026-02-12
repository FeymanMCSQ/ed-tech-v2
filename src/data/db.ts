import { PrismaClient } from "@/prisma";

const prismaClientSingleton = () => {
    // During Next.js build, DATABASE_URL might be missing. 
    // Prisma Thin Client (Accelerate) requires an accelerateUrl to instantiate.
    const url = process.env.DATABASE_URL || (process.env.NODE_ENV === "production" ? "prisma://placeholder" : undefined);

    return new PrismaClient({
        accelerateUrl: url,
    });
};

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const db = globalThis.prisma ?? prismaClientSingleton();

export default db;

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
