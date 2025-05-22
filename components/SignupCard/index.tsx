"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SiFacebook, SiGoogle } from '@icons-pack/react-simple-icons';

export default function SignupCard({ toggle }: { toggle: () => void }) {
    return (
        <div className="bg-white rounded-xs shadow-md p-6 w-full max-w-md">
            <h1 className="text-2xl font-bold mb-4">Sign up</h1>
            <div className="flex gap-2 mb-2">
                <Input placeholder="First Name" />
                <Input placeholder="Last Name" />
            </div>
            <Input placeholder="Email" className="mb-2" />
            <Input placeholder="Password" type="password" className="mb-2" />
            <Input placeholder="Confirm Password" type="password" className="mb-4" />
            <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold mb-4">
                Sign Up
            </Button>
            <div className="text-center text-gray-600 font-medium mb-4">OR</div>
            <Button className="w-full bg-[#3b5998] hover:bg-[#334d84] text-white font-semibold mb-2">
                <span className="mr-2"><SiFacebook /></span> Continue with Facebook
            </Button>
            <Button className="w-full bg-[#4285F4] hover:bg-[#357ae8] text-white font-semibold">
                <span className="mr-2"><SiGoogle /></span> Continue with Google
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
