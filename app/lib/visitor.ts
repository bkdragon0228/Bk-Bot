import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { cookies } from "next/headers";

let fpPromise: Promise<any> | null = null;

export async function getVisitorId(): Promise<string> {
    if (typeof window === "undefined") {
        // 서버 사이드에서는 쿠키 사용
        const cookieStore = await cookies();
        const visitorId = cookieStore.get("visitor_id")?.value;
        if (visitorId) return visitorId;

        // 새로운 임시 ID 생성
        return Math.random().toString(36).substring(7);
    }

    // 클라이언트 사이드에서는 fingerprint 사용
    if (!fpPromise) {
        fpPromise = FingerprintJS.load();
    }

    const fp = await fpPromise;
    const result = await fp.get();
    return result.visitorId;
}
