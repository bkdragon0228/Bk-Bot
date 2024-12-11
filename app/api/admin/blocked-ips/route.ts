import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
    const blockedIPs = await prisma.blockedIP.findMany({
        orderBy: { blockedAt: "desc" },
    });

    return NextResponse.json({ blockedIPs });
}

export async function DELETE(request: Request) {
    const { ip } = await request.json();

    await prisma.blockedIP.delete({
        where: { ip },
    });

    return NextResponse.json({ success: true });
}
