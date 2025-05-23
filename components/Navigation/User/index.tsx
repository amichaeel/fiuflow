"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
} from "@/components/ui/dialog";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import LoginCard from "@/components/Auth/LoginCard";   // Adjust import as needed
import SignupCard from "@/components/Auth/SignupCard"; // Adjust import as needed

export default function UserButton() {
    const { data: session } = useSession();
    const [isLogin, setIsLogin] = useState(true);
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    if (!session?.user) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <span className={`${pathname == "/" ? "text-accent md:hidden" : "text-accent-foreground"} inline text-accent text-sm font-semibold cursor-pointer hover:underline`}>
                        Log in
                    </span>
                </DialogTrigger>
                <DialogContent className="p-0 max-w-md border-none bg-transparent shadow-none">
                    <DialogTitle className="sr-only">Login</DialogTitle>

                    {isLogin ? (
                        <LoginCard toggle={() => setIsLogin(false)} />
                    ) : (
                        <SignupCard toggle={() => setIsLogin(true)} />
                    )}
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                    {session.user.image ? (
                        <AvatarImage src={session.user.image} alt="User avatar" />
                    ) : (
                        <AvatarFallback className="text-xs">
                            {session.user.name ? session.user.name.charAt(0).toUpperCase() + session.user.name.split(" ")[1].charAt(0) : "?"}
                        </AvatarFallback>
                    )}
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 mt-2 rounded-xs">
                <DropdownMenuItem asChild>
                    <a href="/profile" className="w-full">
                        View profile
                    </a>
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
