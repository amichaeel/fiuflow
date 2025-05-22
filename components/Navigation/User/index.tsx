"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function UserButton() {
    const { data: session } = useSession();

    if (!session?.user) {
        return (
            <Link href="/">
                <span className="hidden md:inline text-sm font-semibold cursor-pointer hover:underline">
                    Log in
                </span>
            </Link>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                    {session.user.image ? (
                        <AvatarImage src={session.user.image} alt="User avatar" />
                    ) : (
                        <AvatarFallback>
                            {session.user.name?.charAt(0).toUpperCase() ?? "?"}
                        </AvatarFallback>
                    )}
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 mt-2 rounded-xs">
                <DropdownMenuItem asChild>
                    <Link href="/profile" className="w-full">
                        View profile
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-red-600 cursor-pointer"
                >
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
