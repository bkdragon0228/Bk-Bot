import jwt from "jsonwebtoken";

interface SessionPayload {
    ip: string;
    createdAt: number;
    uuid: string;
}

export function generateSessionToken(ip: string): string {
    const payload: SessionPayload = {
        ip,
        createdAt: Date.now(),
        uuid: crypto.randomUUID(),
    };

    // JWT 토큰 생성 (예: 30일 만료)
    const token = jwt.sign(
        payload,
        "temporary-secret-key", // 임시로 문자열 사용
        { expiresIn: "30d" }
    );

    return token;
}

// 토큰에서 정보 추출
export function decodeSessionToken(token: string): SessionPayload | null {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as SessionPayload;
        return decoded;
    } catch (error) {
        console.error("Token decode error:", error);
        return null;
    }
}

export function getClientIP(request: Request): string {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIP = request.headers.get("x-real-ip");
    return forwardedFor?.split(",")[0] || realIP || "unknown";
}
