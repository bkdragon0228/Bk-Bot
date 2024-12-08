import FingerprintJS from "@fingerprintjs/fingerprintjs";

const VISITOR_ID_KEY = "visitorId";

export async function getVisitorId(): Promise<string> {
    // 로컬 스토리지에서 먼저 확인
    const storedVisitorId = localStorage.getItem(VISITOR_ID_KEY);
    if (storedVisitorId) {
        return storedVisitorId;
    }

    try {
        // FingerprintJS로 새 ID 생성
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        const visitorId = result.visitorId;

        // 생성된 ID를 로컬 스토리지에 저장
        localStorage.setItem(VISITOR_ID_KEY, visitorId);
        return visitorId;
    } catch (error) {
        console.error("Error generating visitor ID:", error);
        // 에러 발생 시 랜덤 ID 생성
        const fallbackId = Math.random().toString(36).substring(2);
        localStorage.setItem(VISITOR_ID_KEY, fallbackId);
        return fallbackId;
    }
}
