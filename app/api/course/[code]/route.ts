import { NextRequest } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const code = url.pathname.split("/").pop();

    const course = await prisma.course.findFirst({
        where: {
            code,
            status: "Active",
        },
    });

    if (!course) {
        return new Response(JSON.stringify({ error: "Course not found or inactive" }), { status: 404 });
    }

    return Response.json(course);
}