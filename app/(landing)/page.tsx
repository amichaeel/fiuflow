"use client";

import { useState } from "react";
import Search from "@/components/Search";
import LoginCard from "@/components/Auth/LoginCard";
import SignupCard from "@/components/Auth/SignupCard";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const [isLogin, setIsLogin] = useState(true);

  return (
    <main className="w-full flex items-center justify-center min-h-screen p-10 bg-[#001d4a]">
      <div className="flex flex-row items-center justify-center w-full gap-10 max-w-7xl">
        <div className="flex flex-col justify-start gap-6 w-full max-w-2xl">
          <span className="font-bold text-3xl leading-snug text-accent">
            Explore thousands of course and professor reviews from FIU students
          </span>
          <Search />
        </div>
        <div className="hidden md:flex min-w-96 max-w-96">
          {!session?.user && (
            isLogin ? (
              <LoginCard toggle={() => setIsLogin(false)} />
            ) : (
              <SignupCard toggle={() => setIsLogin(true)} />
            )
          )}
        </div>
      </div>
    </main>
  );
}
