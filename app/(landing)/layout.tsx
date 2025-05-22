import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import LandingNavbar from "@/components/Navigation/Landing";
import SessionWrapper from "@/components/SessionWrapper";
import { getAuthSession } from "@/lib/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FIU Flow"
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  const session = await getAuthSession();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-[#081E3F] antialiased`}
      >
        <SessionWrapper session={session}>
          <LandingNavbar />
          {children}
        </SessionWrapper>
      </body>
    </html>
  );
}
