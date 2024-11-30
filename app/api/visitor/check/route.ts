import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const visitorId = searchParams.get("visitorId");

        if (!visitorId) {
            return NextResponse.json({ error: "Visitor ID is required" }, { status: 400 });
        }

        // 해당 visitorId로 존재하는 채팅 기록이 있는지 확인
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
        console.error("Error checking visitor:", error);
        return NextResponse.json({ error: "Failed to check visitor" }, { status: 500 });
    }
}
