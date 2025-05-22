'use client'

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { Spinner } from "../ui/spinner";

type Course = {
    id: string;
    code: string;
    name: string;
};

export default function CourseList({ pageSize = 20 }: { pageSize?: number }) {
    const [courses, setCourses] = useState<Course[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [sortBy, setSortBy] = useState<"code" | "name">("code");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const observerRef = useRef<IntersectionObserver | null>(null);
    const sentinelRef = useRef<HTMLDivElement>(null);

    const fetchCourses = useCallback(async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        try {
            const res = await fetch(
                `/api/course/all?page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}`
            );
            const data = await res.json();

            if (data.courses.length < pageSize) {
                setHasMore(false);
            }

            setCourses((prev) => [...prev, ...data.courses]);
            setPage((prev) => prev + 1);
        } catch (err) {
            console.error("Failed to fetch courses", err);
        }
        setLoading(false);
    }, [page, pageSize, sortBy, sortOrder, loading, hasMore]);

    useEffect(() => {
        if (!sentinelRef.current || !hasMore) return;

        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !loading) {
                fetchCourses();
            }
        });

        observerRef.current.observe(sentinelRef.current);

        return () => observerRef.current?.disconnect();
    }, [fetchCourses, hasMore, loading]);

    const handleSort = (column: "code" | "name") => {
        if (sortBy === column) {
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortBy(column);
            setSortOrder("asc");
        }
        setPage(1);
        setCourses([]);
        setHasMore(true);
    };

    return (
        <div className="bg-white">
            <table className="w-full text-left mb-4">
                <thead>
                    <tr>
                        <th
                            className="py-2 px-4 cursor-pointer"
                            onClick={() => handleSort("code")}
                        >
                            Course Code{" "}
                            {sortBy === "code" && (sortOrder === "asc" ? "↑" : "↓")}
                        </th>
                        <th
                            className="py-2 px-4 cursor-pointer"
                            onClick={() => handleSort("name")}
                        >
                            Course Name{" "}
                            {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                        </th>
                        <th className="py-2 px-4">Ratings</th>
                        <th className="py-2 px-4">Useful</th>
                        <th className="py-2 px-4">Easy</th>
                        <th className="py-2 px-4">Liked</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map((course, index) => {
                        let digIndex = 0;
                        for (let i = 0; i < course.code.length; i++) {
                            if (/\d/.test(course.code[i])) {
                                digIndex = i;
                                break;
                            }
                        }
                        const code = course.code.slice(0, digIndex) + " " + course.code.slice(digIndex);
                        return (
                            <tr key={index}>
                                <td className="py-2 cursor-pointer text-[#B7862C] font-semibold underline px-4">
                                    <Link href={`/course/${course.code}`}>
                                        {code}
                                    </Link>
                                </td>
                                <td className="py-2 px-4">{course.name}</td>
                                <td className="py-2 px-4">-</td>
                                <td className="py-2 px-4">-</td>
                                <td className="py-2 px-4">-</td>
                                <td className="py-2 px-4">-</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {loading && (
                <div className="text-center py-4">
                    <Spinner />
                </div>
            )}

            <div ref={sentinelRef} className="h-10" />
        </div>
    );
}
