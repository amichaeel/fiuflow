import { NextRequest } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "20", 10);
    const sortBy = searchParams.get("sortBy") || "code";
    const sortOrder = searchParams.get("sortOrder") || "asc";

    const skip = (page - 1) * pageSize;
    const filter = { status: "Active" };

    const [courses, total] = await Promise.all([
        prisma.course.findMany({
            skip,
            take: pageSize,
            where: filter,
            orderBy: { [sortBy]: sortOrder },
            select: {
                id: true,
                code: true,
                name: true,
            },
        }),
        prisma.course.count({ where: filter }),
    ]);

    return Response.json({ courses, total });
}
