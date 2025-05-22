"use client";

import { useState } from "react";
import Search from "@/components/Search";
import LoginCard from "@/components/LoginCard";
import SignupCard from "@/components/SignupCard";

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <main className="w-full flex flex-col items-center justify-center min-h-screen p-10 bg-[#001d4a]">
      <div className="flex items-center justify-center w-full gap-10 flex-wrap max-w-7xl">
        <div className="flex flex-col justify-start gap-6 w-full max-w-2xl text-white">
          <span className="font-bold text-3xl leading-snug">
            Explore thousands of course and professor reviews from FIU students
          </span>
          <Search />
        </div>

        {isLogin ? (
          <LoginCard toggle={() => setIsLogin(false)} />
        ) : (
          <SignupCard toggle={() => setIsLogin(true)} />
        )}
      </div>
    </main>
  );
}
