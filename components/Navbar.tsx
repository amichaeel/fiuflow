"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="w-full border-b bg-white sticky top-0 z-50">
            <div className="container mx-auto max-w-6xl flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-1 font-bold text-xl">
                    <span className="text-[#B7862C]">FIU</span>
                    <span className="text-gray-900">Flow</span>
                </Link>

                {/* Desktop Search */}
                <div className="hidden md:flex flex-1 mx-8">
                    <Input
                        type="search"
                        placeholder="Search courses, subjects, or professors"
                    />
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-4">
                    {/* <Link href="/courses">
                        <Button variant="ghost">Courses</Button>
                    </Link>
                    <Link href="/planner">
                        <Button variant="ghost">Planner</Button>
                    </Link>
                    <Link href="/about">
                        <Button variant="ghost">About</Button>
                    </Link> */}
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