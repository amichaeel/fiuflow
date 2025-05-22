"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SiFacebook, SiGoogle } from "@icons-pack/react-simple-icons";

export default function LoginCard({ toggle }: { toggle: () => void }) {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleLogin = async () => {
        setError("");

        const res = await signIn("credentials", {
            email: form.email,
            password: form.password,
            callbackUrl: "/explore",
            redirect: false,
        });

        if (!res?.ok) {
            setError("Invalid email or password");
        } else {
            window.location.href = res.url || "/explore";
        }
    };

    return (
        <div className="bg-white rounded-xs shadow-md p-6 w-full max-w-md">
            <h1 className="text-2xl font-bold mb-4">Log in</h1>
            <Input
                name="email"
                placeholder="Email"
                className="mb-2"
                value={form.email}
                onChange={handleChange}
            />
            <Input
                name="password"
                placeholder="Password"
                type="password"
                className="mb-1"
                value={form.password}
                onChange={handleChange}
            />
            <div className="text-right text-sm text-blue-800 mb-4 cursor-pointer hover:underline">
                Forgot password?
            </div>
            {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
            <Button
                onClick={handleLogin}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold mb-4"
            >
                Log in
            </Button>
            <div className="text-center text-gray-600 font-medium mb-4">OR</div>
            <Button disabled
                onClick={() => signIn("facebook", { callbackUrl: "/explore" })}
                className="w-full bg-[#3b5998] hover:bg-[#334d84] text-white font-semibold mb-2"
            >
                <span className="mr-2">
                    <SiFacebook />
                </span>{" "}
                Continue with Facebook
            </Button>
            <Button disabled
                onClick={() => signIn("google", { callbackUrl: "/explore" })}
                className="w-full bg-[#4285F4] hover:bg-[#357ae8] text-white font-semibold"
            >
                <span className="mr-2">
                    <SiGoogle />
                </span>{" "}
                Continue with Google
            </Button>
            <p className="text-xs text-center text-gray-500 mt-4">
                Read our <span className="underline cursor-pointer">Privacy Policy</span>
            </p>
            <p className="text-sm text-center mt-4">
                New to FIU Flow?{" "}
                <button onClick={toggle} className="text-blue-800 underline cursor-pointer">
                    Sign up
                </button>
            </p>
        </div>
    );
}
