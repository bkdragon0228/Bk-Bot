import FingerprintJS from "@fingerprintjs/fingerprintjs";

interface FingerprintResult {
    visitorId: string;
}

interface FingerprintAgent {
    get: () => Promise<FingerprintResult>;
}

export async function getVisitorId(): Promise<string> {
    let fpPromise: Promise<FingerprintAgent> | null = null;

    if (!fpPromise) {
        fpPromise = FingerprintJS.load();
    }

    const fp = await fpPromise;
    const result = await fp.get();
    return result.visitorId;
}
