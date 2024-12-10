import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Visitor } from "@prisma/client";

export async function GET() {
    try {
        const existingToken = cookies().get("sessionToken")?.value;

        let visitor: Visitor | null = null;

        if (existingToken) {
            visitor = await prisma.visitor.findUnique({
                where: { sessionId: existingToken },
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
