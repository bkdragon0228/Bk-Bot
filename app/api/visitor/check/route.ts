import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const visitorId = searchParams.get("visitorId");

        if (!visitorId) {
            return NextResponse.json({ error: "Visitor ID is required" }, { status: 400 });
        }

        const existingVisitor = await prisma.visitor.findUnique({
            where: {
                id: visitorId,
            },
            select: {
                id: true,
                name: true,
            },
        });

        return NextResponse.json({
            exists: !!existingVisitor,
            name: existingVisitor?.name || "",
        });
    } catch (error) {
        console.error("Error checking visitor:", error);
        return NextResponse.json({ error: "Failed to check visitor" }, { status: 500 });
    }
}
