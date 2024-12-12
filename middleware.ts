import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    if (!request.nextUrl.pathname.startsWith("/api") || request.nextUrl.pathname === "/api/auth/check-ip") {
        return NextResponse.next();
    }

    try {
        const ipCheckResponse = await fetch(`${request.nextUrl.origin}/api/auth/check-ip`, {
            method: "POST",
            headers: {
                "x-forwarded-for": request.headers.get("x-forwarded-for") || request.ip || "",
                "user-agent": request.headers.get("user-agent") || "",
                // 필요한 경우 추가 헤더
            },
        });

        if (!ipCheckResponse.ok) {
            const error = await ipCheckResponse.json();
            return NextResponse.json(error, { status: ipCheckResponse.status });
        }

        return NextResponse.next();
    } catch (error) {
        console.error("Middleware error:", error);
        return NextResponse.next();
    }
}

export const config = {
    matcher: "/api/:path*",
};
