import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Visitor } from "@prisma/client";
import { getClientIP } from "@/app/lib/session";

export async function GET(request: Request) {
    try {
        const currentIP = getClientIP(request);
        const existingToken = cookies().get("sessionToken")?.value;

        let visitor: Visitor | null = null;

        if (existingToken) {
            visitor = await prisma.visitor.findUnique({
                where: { sessionId: existingToken },
            });
        }

        if (visitor && visitor.lastKnownIP !== currentIP) {
            await prisma.visitor.update({
                where: { id: visitor.id },
                data: { lastKnownIP: currentIP },
            });
        }

        return NextResponse.json({
            exists: !!visitor,
            name: visitor?.name || "",
        });
    } catch (error) {
        console.error("Error checking visitor:", error);
        return NextResponse.json({ error: "Failed to check visitor" }, { status: 500 });
    }
}
