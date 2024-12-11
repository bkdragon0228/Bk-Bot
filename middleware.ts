import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    if (!request.nextUrl.pathname.startsWith("/api")) {
        return NextResponse.next();
    }

    try {
        const ipCheckResponse = await fetch(`${request.nextUrl.origin}/api/auth/check-ip`, {
            method: "POST",
            headers: {
                "x-forwarded-for": request.headers.get("x-forwarded-for") || "",
                "x-real-ip": request.headers.get("x-real-ip") || "",
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
