import { prisma } from "@/app/lib/prisma";
import { getVisitorId } from "@/app/lib/visitor";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const visitorId = await getVisitorId();

        const chats = await prisma.chat.findMany({
            where: {
                visitorId,
            },
            orderBy: {
                timestamp: "asc",
            },
            select: {
                id: true,
                role: true,
                content: true,
                timestamp: true,
            },
        });

        return NextResponse.json({ chats });
    } catch (error) {
        console.error("Error fetching chat history:", error);
        return NextResponse.json({ error: "Failed to fetch chat history" }, { status: 500 });
    }
}
