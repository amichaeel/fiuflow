"use client";

import Link from "next/link";
import UserButton from "../User";

export default function LandingNavbar() {
    return (
        <nav className="w-full absolute bg-transparent top-0 z-50">
            <div className="container mx-auto max-w-6xl gap-8 flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-1 font-semibold text-2xl">
                    <span className="text-gray-100">FIU</span>
                    <span className="text-gray-100">Flow</span>
                </Link>

                {/* Desktop Nav */}
                <UserButton />

                {/* Mobile Nav */}
                {/* <div className="md:hidden flex items-center gap-2">
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
                </div> */}
            </div>
        </nav>
    );
}