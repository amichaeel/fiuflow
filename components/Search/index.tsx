import { useState, useEffect, useRef, useCallback } from "react";
import { Course, Professor } from '@prisma/client';
import { Input } from "@/components/ui/input";
import { Spinner } from "../ui/spinner";
import { Layers, Book, User } from "lucide-react";
import Link from "next/link";

export default function Search() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<{ courses: Course[]; professors: Professor[] }>({ courses: [], professors: [] });
    const [fetching, setFetching] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const fetchResults = useCallback(async (search: string) => {
        setFetching(true);
        if (search.length === 0) {
            setResults({ courses: [], professors: [] });
            setFetching(false);
            return;
        }

        try {
            const res = await fetch(`/api/search?q=${encodeURIComponent(search)}`);
            const data = await res.json();
            setResults(data);
        } catch (err) {
            console.error("Search failed:", err);
        } finally {
            setFetching(false);
        }
    }, []);

    useEffect(() => {
        const delay = setTimeout(() => {
            fetchResults(query);
        }, 50);
        return () => clearTimeout(delay);
    }, [query, fetchResults]);

    // Hide dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="flex flex-1 flex-col relative" ref={dropdownRef}>
            <Input
                type="search"
                value={query}
                onFocus={() => setDropdownOpen(true)}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setDropdownOpen(true);
                }}
                placeholder="Search courses, subjects, or professors"
            />
            {dropdownOpen && (
                <div className="absolute left-0 top-full w-full bg-white shadow-md z-50 flex flex-col max-h-[400px] overflow-y-auto">
                    {fetching && (
                        <div className="px-3 py-2 border-t border-gray-100">
                            <Spinner />
                        </div>
                    )}
                    {results.courses.map((course) => (
                        <Link
                            key={course.id}
                            href={`/course/${course.code}`}
                            className="flex items-center gap-2 px-3 py-2 text-[#B7862C] hover:bg-blue-600 hover:text-white transition-colors cursor-pointer border-t border-gray-100 first:border-none"
                        >
                            <Book className="h-4 w-4" />
                            <span className="text-sm">{course.code} – {course.name}</span>
                        </Link>
                    ))}

                    {results.professors.map((prof) => (
                        <Link
                            key={prof.id}
                            href={`/professor/${prof.id}`}
                            className="flex items-center gap-2 px-3 py-2 text-green-600 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer border-t border-gray-100"
                        >
                            <User className="h-4 w-4" />
                            <span className="text-sm">{prof.name}</span>
                        </Link>
                    ))}

                    <Link
                        href="/explore"
                        className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer border-t border-gray-100"
                    >
                        <Layers className="h-4 w-4" />
                        <span className="text-sm font-semibold">Explore all courses and professors</span>
                    </Link>
                </div>
            )}
        </div>
    )
}