"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "./ui/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Layers, Menu, Book, User } from "lucide-react";
import { Course, Professor } from "@prisma/client";

export default function Navbar() {
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

    // Debounce fetch
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
        <nav className="w-full border-b bg-white sticky top-0 z-50">
            <div className="container mx-auto max-w-6xl gap-8 flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="hidden md:flex items-center gap-1 font-semibold text-2xl">
                    <span className="text-gray-900">FIU</span>
                    <span className="text-[#B6862C]">Flow</span>
                </Link>

                {/* Desktop Search */}
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

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-4">
                    <Avatar>
                        <AvatarImage src="/avatar.png" alt="User" />
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                </div>

                {/* Mobile Nav */}
                <div className="md:hidden flex items-center gap-2">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64">
                            <div className="flex flex-col gap-4 mt-8">
                                <Link href="/" className="font-bold text-xl mb-4">
                                    fiuflow
                                </Link>
                                <Link href="/courses">
                                    <Button variant="ghost" className="w-full justify-start">
                                        Courses
                                    </Button>
                                </Link>
                                <Link href="/planner">
                                    <Button variant="ghost" className="w-full justify-start">
                                        Planner
                                    </Button>
                                </Link>
                                <Link href="/about">
                                    <Button variant="ghost" className="w-full justify-start">
                                        About
                                    </Button>
                                </Link>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
}