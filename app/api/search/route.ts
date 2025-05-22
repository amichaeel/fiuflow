import { NextRequest } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim().toLowerCase();

    if (!q || q.length == 0) return Response.json({ courses: [], professors: [] });

    const [courses, professors] = await Promise.all([
        prisma.course.findMany({
            where: {
                status: "Active",
                OR: [
                    { name: { contains: q, mode: "insensitive" } },
                    { code: { contains: q, mode: "insensitive" } }
                ]
            },
            select: { id: true, code: true, name: true },
            take: 3,
        }),
        prisma.professor.findMany({
            where: {
                name: { contains: q, mode: "insensitive" }
            },
            select: { id: true, name: true },
            take: 3,
        }),
    ]);

    return Response.json({ courses, professors });
}
