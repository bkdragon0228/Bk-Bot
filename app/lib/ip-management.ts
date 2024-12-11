import { prisma } from "./prisma";

export async function blockIP(ip: string, reason: string, duration: number) {
    const expiresAt = new Date(Date.now() + duration);

    return await prisma.blockedIP.create({
        data: {
            ip,
            reason,
            expiresAt,
        },
    });
}

export async function unblockIP(ip: string) {
    return await prisma.blockedIP.delete({
        where: { ip },
    });
}

export async function isIPBlocked(ip: string): Promise<boolean> {
    const blockedIP = await prisma.blockedIP.findUnique({
        where: { ip },
    });

    return !!(blockedIP && (!blockedIP.expiresAt || blockedIP.expiresAt > new Date()));
}

export async function checkIPAccess(ip: string) {
    const response = await fetch("/api/auth/check-ip", {
        method: "POST",
        headers: {
            "x-forwarded-for": ip,
        },
    });

    if (!response.ok) {
        throw new Error("IP access denied");
    }

    return true;
}
