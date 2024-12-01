import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const visitorId = searchParams.get("visitorId");

        if (!visitorId) {
            return NextResponse.json({ error: "Visitor ID is required" }, { status: 400 });
        }

        // Check if there are chat records for the given visitorId
        const existingChat = await prisma.chat.findFirst({
            where: {
                visitorId,
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
        return NextResponse.json({ error: "Failed to check chat records" }, { status: 500 });
    }
}
