import { prisma } from "@/app/lib/prisma";

interface VisitorRequest {
    visitorId: string;
}

export async function POST(req: Request) {
    const body: VisitorRequest = await req.json();
    const { visitorId } = body;

    console.log(visitorId, "visitorId");

    if (!visitorId) {
        return new Response("Visitor ID is required", { status: 400 });
    }

    await prisma.visitor.upsert({
        where: { id: visitorId },
        update: { lastVisitAt: new Date() },
        create: {
            id: visitorId,
            lastVisitAt: new Date(),
        },
    });

    return new Response("Success", { status: 200 });
}
