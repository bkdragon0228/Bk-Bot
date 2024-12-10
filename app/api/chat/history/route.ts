import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
    try {
        const sessionToken = cookies().get("sessionToken")?.value;

        if (!sessionToken) {
            return NextResponse.json(
                {
                    error: "No session found",
                },
                { status: 401 }
            );
        }

        const chats = await prisma.chat.findMany({
            where: {
                visitor: {
                    sessionId: sessionToken,
                },
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
        return NextResponse.json(
            {
                error: "Failed to fetch chat history",
            },
            { status: 500 }
        );
    }
}
