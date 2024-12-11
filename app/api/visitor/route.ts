import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { generateSessionToken, getClientIP } from "@/app/lib/session";

interface VisitorRequest {
    name?: string;
}

export async function POST(request: Request) {
    try {
        const body: VisitorRequest = await request.json();
        const { name } = body;

        const clientIP = getClientIP(request);

        // 오늘 생성된 같은 IP의 방문자 수 확인
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const visitorCount = await prisma.visitor.count({
            where: {
                lastKnownIP: clientIP,
                createdAt: {
                    gte: today,
                },
            },
        });

        // 하루 제한(3명) 체크
        if (visitorCount >= 3) {
            return NextResponse.json(
                {
                    error: "Daily visitor limit reached for this IP",
                    success: false,
                },
                { status: 429 } // Too Many Requests
            );
        }

        const newToken = generateSessionToken(clientIP);

        // 새로운 방문자 생성
        const visitor = await prisma.visitor.create({
            data: {
                sessionId: newToken,
                lastKnownIP: clientIP,
                name,
            },
        });

        // 쿠키에 토큰 저장
        cookies().set("sessionToken", newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60, // 30일
        });

        return NextResponse.json(
            {
                success: true,
                visitor: {
                    id: visitor.id,
                    questionCount: 0,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Visitor creation error:", error);
        return NextResponse.json(
            {
                error: "Failed to create visitor",
            },
            { status: 500 }
        );
    }
}

interface UpdateVisitorNameRequest {
    visitorId: string;
    name: string;
}

export async function PUT(req: Request) {
    const body: UpdateVisitorNameRequest = await req.json();
    const { visitorId, name } = body;

    if (!visitorId || !name) {
        return new Response("Visitor ID and name are required", { status: 400 });
    }

    await prisma.visitor.update({
        where: { id: visitorId },
        data: { name },
    });

    return new Response("Name updated successfully", { status: 200 });
}
