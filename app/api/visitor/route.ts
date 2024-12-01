import { prisma } from "@/app/lib/prisma";

interface VisitorRequest {
    visitorId: string;
    name?: string;
}

export async function POST(req: Request) {
    const body: VisitorRequest = await req.json();
    const { visitorId, name } = body;

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
            name,
        },
    });

    return new Response("Success", { status: 200 });
}

interface UpdateVisitorNameRequest {
    visitorId: string;
    name: string;
}

export async function PUT(req: Request) {
    const body: UpdateVisitorNameRequest = await req.json();
    const { visitorId, name } = body;

    if (!visitorId || !name) {
        return new Response("Visitor ID and name are required", { status: 400 });
    }

    await prisma.visitor.update({
        where: { id: visitorId },
        data: { name },
    });

    return new Response("Name updated successfully", { status: 200 });
}
