import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
    try {
        const sessionToken = cookies().get("sessionToken")?.value;

        if (!sessionToken) {
            return NextResponse.json({ exists: false });
        }

        const existingChat = await prisma.chat.findFirst({
            where: {
                visitor: {
                    sessionId: sessionToken,
                },
            },
            select: {
                id: true,
                timestamp: true,
            },
        });

        return NextResponse.json({
            exists: !!existingChat,
        });
    } catch (error) {
        console.error("Error checking chat records:", error);
        return NextResponse.json(
            {
                error: "Failed to check chat records",
            },
            { status: 500 }
        );
    }
}
