import { NextRequest } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "20", 10);
    const sortBy = searchParams.get("sortBy") || "name";
    const sortOrder = searchParams.get("sortOrder") === "desc" ? "desc" : "asc";

    const skip = (page - 1) * pageSize;

    const safeSortFields = ["name", "createdAt"];
    const sortKey = safeSortFields.includes(sortBy) ? sortBy : "name";

    const [professors, total] = await Promise.all([
        prisma.professor.findMany({
            skip,
            take: pageSize,
            orderBy: { [sortKey]: sortOrder },
            select: {
                id: true,
                name: true,
                createdAt: true,
            },
        }),
        prisma.professor.count(),
    ]);

    return Response.json({ professors, total });
}