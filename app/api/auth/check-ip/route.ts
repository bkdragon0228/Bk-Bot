import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { getClientIP } from "@/app/lib/session";

const RATE_LIMIT_WINDOW = 60 * 1000; // 1분
const MAX_REQUESTS = 30; // 분당 최대 요청 수

export async function POST(request: Request) {
    const ip = getClientIP(request);

    try {
        // IP 차단 확인
        const blockedIP = await prisma.blockedIP.findUnique({
            where: { ip },
        });

        if (blockedIP && (!blockedIP.expiresAt || blockedIP.expiresAt > new Date())) {
            return NextResponse.json({ error: "IP is blocked" }, { status: 403 });
        }

        // 레이트 리미팅 체크
        const recentRequests = await prisma.requestLog.count({
            where: {
                ip,
                timestamp: {
                    gte: new Date(Date.now() - RATE_LIMIT_WINDOW),
                },
            },
        });

        if (recentRequests >= MAX_REQUESTS) {
            // IP 차단 추가
            await prisma.blockedIP.create({
                data: {
                    ip,
                    reason: "Rate limit exceeded",
                    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24시간 차단
                },
            });

            return NextResponse.json({ error: "Too many requests" }, { status: 429 });
        }

        // 요청 로그 기록
        await prisma.requestLog.create({
            data: {
                ip,
                endpoint: request.url,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("IP check error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
