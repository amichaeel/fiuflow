"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Gauge } from "@/components/gauge";

type Course = {
    id: string;
    code: string;
    name: string;
    longName: string;
    description?: string;
    status: string;
};

const CoursePage = () => {
    const params = useParams();
    const code = params?.code as string | undefined;
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!code) return;
        setLoading(true);
        fetch(`/api/course/${code}`)
            .then((res) => {
                if (!res.ok) throw new Error("Course not found or inactive");
                return res.json();
            })
            .then((data) => {
                setCourse(data);
                setError(null);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [code]);

    if (loading)
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <Spinner />
            </div>
        );

    if (error)
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <p>That course doesn&apos;t exist!</p>
                <Button
                    onClick={() => (window.location.href = "/explore")}
                    className="mt-4 cursor-pointer"
                >
                    Home
                </Button>
            </div>
        );

    if (!course) return null;

    return (
        <main className="w-full">
            <div className="relative flex flex-col justify-end pt-60 pb-4 text-white px-4 min-h-[300px] overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center z-[-2] bg-[#001d4a]"
                    style={{
                        backgroundImage: "url('/statue_2d.png')",
                        backgroundPositionY: "30%",
                        backgroundBlendMode: "luminosity",
                    }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 z-[-1]" />

                <div className="relative z-10 w-full max-w-6xl mx-auto">
                    <h1 className="text-2xl font-bold mb-2">{course.code}</h1>
                    <h1 className="text-4xl max-w-xl mb-2">{course.longName}</h1>
                </div>
            </div>

            <div className="flex items-center w-full px-4 py-4 bg-white">
                <div className="flex flex-col-reverse md:grid md:grid-cols-5 gap-10 mx-auto w-full max-w-6xl">
                    <div className="col-span-3">
                        <p>{course.description}</p>
                    </div>

                    <div className="flex md:rounded-l-full h-[200px] justify-between bg-white md:shadow-sm col-span-2 md:relative md:-translate-y-8">
                        <div className="md:relative h-full">
                            <Gauge numerator={874} denominator={1000} />
                        </div>
                        <div className="p-4 text-gray-600">test</div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default CoursePage;
