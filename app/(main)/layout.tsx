import "../globals.css";
import SessionWrapper from "@/components/SessionWrapper";
import { getAuthSession } from "@/lib/auth";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navigation/Global";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
    title: "FIU Flow",
};

export default async function MainLayout({ children }: { children: React.ReactNode }) {
    const session = await getAuthSession();

    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} bg-gray-50 antialiased`}>
                <SessionWrapper session={session}>
                    <Navbar />
                    {children}
                </SessionWrapper>
            </body>
        </html>
    );
}
