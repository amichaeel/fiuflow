"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SiFacebook, SiGoogle } from "@icons-pack/react-simple-icons";
import { signIn } from "next-auth/react";

export default function SignupCard({ toggle }: { toggle: () => void }) {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async () => {
        setError("");

        if (
            !form.firstName ||
            !form.lastName ||
            !form.email ||
            !form.password ||
            !form.confirmPassword
        ) {
            setError("All fields are required.");
            return;
        }

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                password: form.password,
            }),
        });

        if (!res.ok) {
            const data = await res.json();
            setError(data.error || "Registration failed");
            return;
        }

        await signIn("credentials", {
            email: form.email,
            password: form.password,
            callbackUrl: "/explore",
        });
    };

    return (
        <div className="bg-white rounded-xs shadow-md p-6 w-full max-w-md">
            <h1 className="text-2xl font-bold mb-4">Sign up</h1>
            <div className="flex gap-2 mb-2">
                <Input
                    name="firstName"
                    placeholder="First Name"
                    value={form.firstName}
                    onChange={handleChange}
                />
                <Input
                    name="lastName"
                    placeholder="Last Name"
                    value={form.lastName}
                    onChange={handleChange}
                />
            </div>
            <Input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="mb-2"
            />
            <Input
                name="password"
                placeholder="Password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="mb-2"
            />
            <Input
                name="confirmPassword"
                placeholder="Confirm Password"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="mb-4"
            />
            {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
            <Button
                onClick={handleSubmit}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold mb-4"
            >
                Sign Up
            </Button>
            <div className="text-center text-gray-600 font-medium mb-4">OR</div>
            <Button disabled className="w-full bg-[#3b5998] hover:bg-[#334d84] text-white font-semibold mb-2">
                <span className="mr-2">
                    <SiFacebook />
                </span>{" "}
                Continue with Facebook
            </Button>
            <Button disabled className="w-full bg-[#4285F4] hover:bg-[#357ae8] text-white font-semibold">
                <span className="mr-2">
                    <SiGoogle />
                </span>{" "}
                Continue with Google
            </Button>
            <p className="text-xs text-center text-gray-500 mt-4">
                Read our <span className="underline cursor-pointer">Privacy Policy</span>
            </p>
            <p className="text-sm text-center mt-4">
                Already have an account?{" "}
                <button onClick={toggle} className="text-blue-800 underline cursor-pointer">
                    Log in
                </button>
            </p>
        </div>
    );
}
