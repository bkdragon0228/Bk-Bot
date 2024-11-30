import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const visitorId = searchParams.get("visitorId");

        if (!visitorId) {
            return NextResponse.json({ error: "Visitor ID is required" }, { status: 400 });
        }

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
