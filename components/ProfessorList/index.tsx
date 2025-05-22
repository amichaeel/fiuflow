'use client'

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Spinner } from "../ui/spinner";
import Link from "next/link";

type Professor = {
    id: string;
    name: string;
};

export default function ProfessorList({ pageSize = 20 }: { pageSize?: number }) {
    const [professors, setProfessors] = useState<Professor[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [sortBy, setSortBy] = useState<"name" | "createdAt">("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const observerRef = useRef<IntersectionObserver | null>(null);
    const sentinelRef = useRef<HTMLDivElement>(null);

    const fetchProfessors = useCallback(async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        try {
            const res = await fetch(
                `/api/professor/all?page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}`
            );
            const data = await res.json();

            if (data.professors.length < pageSize) {
                setHasMore(false);
            }

            setProfessors((prev) => [...prev, ...data.professors]);
            setPage((prev) => prev + 1);
        } catch (err) {
            console.error("Failed to fetch professors", err);
        }
        setLoading(false);
    }, [page, pageSize, sortBy, sortOrder, loading, hasMore]);

    useEffect(() => {
        if (!sentinelRef.current || !hasMore) return;

        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !loading) {
                fetchProfessors();
            }
        });

        observerRef.current.observe(sentinelRef.current);

        return () => observerRef.current?.disconnect();
    }, [fetchProfessors, hasMore, loading]);

    const handleSort = (column: "name" | "createdAt") => {
        if (sortBy === column) {
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortBy(column);
            setSortOrder("asc");
        }
        setPage(1);
        setProfessors([]);
        setHasMore(true);
    };

    return (
        <div className="bg-white">
            <table className="w-full text-left mb-4">
                <thead>
                    <tr>
                        <th
                            className="py-2 px-4 text-[#081E3F] font-semibold underline"
                        >
                            <span className='cursor-pointer' onClick={() => handleSort("name")}>Professor Name{" "}</span>
                            {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                        </th>
                        <th className="py-2 px-4 text-[#081E3F] font-semibold underline">Ratings</th>
                        <th className="py-2 px-4 text-[#081E3F] font-semibold underline">Clear</th>
                        <th className="py-2 px-4 text-[#081E3F] font-semibold underline">Engaging</th>
                        <th className="py-2 px-4 text-[#081E3F] font-semibold underline">Liked</th>
                    </tr>
                </thead>
                <tbody>
                    {professors.map((prof, index) => (
                        <tr
                            key={index}
                            className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                        >
                            <td className="py-2 px-4 text-[#B6862C] font-semibold underline">
                                <Link href={`/professor/${prof.id}`}>
                                    {prof.name}
                                </Link>
                            </td>
                            <td className="py-2 px-4">-</td>
                            <td className="py-2 px-4">-</td>
                            <td className="py-2 px-4">-</td>
                            <td className="py-2 px-4">-</td>
                        </tr>
                    ))}
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
