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
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" });

    return token;
}

// 토큰에서 정보 추출
export function decodeSessionToken(token: string): SessionPayload | null {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as SessionPayload;
        return decoded;
    } catch (error) {
        console.error("Token decode error:", error);
        return null;
    }
}

export function getClientIP(request: Request): string {
    // Cloudflare의 실제 클라이언트 IP
    const cfConnectingIP = request.headers.get("cf-connecting-ip");
    if (cfConnectingIP) return cfConnectingIP;

    // X-Forwarded-For 헤더에서 첫 번째 IP 가져오기
    const forwardedFor = request.headers.get("x-forwarded-for");
    if (forwardedFor) {
        const ips = forwardedFor.split(",");
        return ips[0].trim();
    }

    // X-Real-IP 헤더
    const realIP = request.headers.get("x-real-ip");
    if (realIP) return realIP;

    return "unknown";
}
