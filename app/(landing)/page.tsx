"use client";

import { useState } from "react";
import Search from "@/components/Search";
import LoginCard from "@/components/Auth/LoginCard";
import SignupCard from "@/components/Auth/SignupCard";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const [isLogin, setIsLogin] = useState(true);

  const showAuth = !session?.user;

  return (
    <main
      className="w-full flex items-center justify-center min-h-screen px-4 bg-[#001d4a]"
      style={{
        backgroundImage: "url('/statue.jpg')",
        backgroundBlendMode: "overlay",
        backgroundSize: "cover",
      }}

    >
      <div className={`flex flex-col md:flex-row items-center justify-center gap-10 w-full max-w-7xl py-12 rounded-lg`}>
        <div className={`${showAuth ? "md:w-2/3" : "w-full"} flex flex-col items-center justify-start gap-6`}>
          <div className="w-full max-w-2xl flex flex-col gap-10">
            <span className="font-bold text-4xl leading-snug text-accent">
              Explore thousands of course and professor reviews from FIU students
            </span>
            <Search />
          </div>
        </div>
        {showAuth && (
          <div className="hidden md:flex min-w-96 max-w-96">
            {isLogin ? (
              <LoginCard toggle={() => setIsLogin(false)} />
            ) : (
              <SignupCard toggle={() => setIsLogin(true)} />
            )}
          </div>
        )}
      </div>
    </main>
  );
}
