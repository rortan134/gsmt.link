"use server";

import { prisma } from "@/prisma";
import { connection } from "next/server";

/** @internal */
async function updateViewCount() {
    await connection();
    try {
        await prisma.counter.upsert({
            create: { id: 1, visitCount: 1 },
            update: { visitCount: { increment: 1 } },
            where: { id: 1 },
        });
    } catch (error) {
        console.error("Failed to update view count:", error);
    }
}

async function getPageViewCount() {
    await connection();
    try {
        const data = await prisma.counter.findUnique({ where: { id: 1 } });
        return data?.visitCount ?? 0;
    } catch (error) {
        console.error("Failed to get page view count:", error);
        return 0;
    }
}

const UpdateServerViewCounter = async () => {
    await updateViewCount();
    return null;
};

export { getPageViewCount, UpdateServerViewCounter };
