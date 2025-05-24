"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Gauge } from "@/components/gauge";
import { ChevronDown } from "lucide-react";

type CourseSection = {
    classNumber: string;
    section: string;
    term: string;
    time: string;
    location: string;
    instructor: string;
    startDate: string | null;
    endDate: string | null;
    campus: string;
};

type Course = {
    id: string;
    code: string;
    name: string;
    longName: string;
    description?: string;
    status: string;
    sections: CourseSection[];
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

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <Spinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-center">
                <p className="text-lg text-red-600">{error}</p>
                <Button className="mt-4" onClick={() => (window.location.href = "/explore")}>
                    Back to Explore
                </Button>
            </div>
        );
    }

    if (!course) return null;

    return (
        <main className="w-full">
            {/* Hero section */}
            <div className="relative flex flex-col justify-end pt-60 pb-4 text-white px-4 min-h-[300px] overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center z-[-2] bg-[#001d4a]"
                    style={{
                        backgroundImage: "url('/statue_2d.png')",
                        backgroundPositionY: "30%",
                        backgroundBlendMode: "luminosity",
                    }}
                />
                <div className="absolute inset-0 bg-black/50 z-[-1]" />
                <div className="relative z-10 w-full max-w-6xl mx-auto">
                    <h1 className="text-2xl font-bold mb-2">{course.code}</h1>
                    <h1 className="text-4xl max-w-xl mb-2">{course.longName}</h1>
                </div>
            </div>

            {/* Description and Gauge */}
            <div className="flex items-center w-full px-4 py-4 bg-white">
                <div className="flex flex-col-reverse md:grid md:grid-cols-5 gap-10 mx-auto w-full max-w-6xl relative">
                    {/* Description */}
                    <div className="col-span-3">
                        <p>{course.description}</p>
                    </div>

                    {/* Floating Gauge on desktop */}
                    <div className="hidden md:block col-span-2 relative">
                        <div className="absolute top-0 right-0 -translate-y-31 w-full h-[200px] bg-white shadow-sm rounded-l-full flex justify-between">
                            <div className="h-full flex items-center justify-center">
                                <Gauge numerator={874} denominator={1000} />
                            </div>
                            <div className="p-4 text-gray-600">Rating</div>
                        </div>
                    </div>

                    {/* Inline Gauge on mobile */}
                    <div className="md:hidden col-span-2 w-full h-[200px] bg-white flex justify-between">
                        <div className="h-full flex items-center justify-center">
                            <Gauge numerator={874} denominator={1000} />
                        </div>
                        <div className="p-4 text-gray-600">Rating</div>
                    </div>
                </div>
            </div>

            {/* Sections Table */}
            {course.sections && <TabbedSectionView sections={course.sections} />}
        </main>
    );
};

export default CoursePage;

type TabbedSectionViewProps = {
    sections: CourseSection[];
};

const TabbedSectionView = ({ sections }: TabbedSectionViewProps) => {
    const terms = Array.from(new Set(sections.map((s) => s.term)));
    const [selectedTerm, setSelectedTerm] = useState<string>(terms[0]);

    const filtered = sections.filter((s) => s.term === selectedTerm);

    return (
        <div className="w-full mt-12">
            <div className="max-w-6xl mx-auto bg-white">
                <div className="flex justify-between items-stretch border">
                    <h2 className="text-3xl font-bold p-4 -2">Course Schedule</h2>
                    <div className="bg-gray-200 px-6 flex items-center">
                        <ChevronDown />
                    </div>
                </div>

                {/* Term tabs */}
                <div className="flex w-full justify-around">
                    {terms.map((term) => (
                        <button
                            key={term}
                            onClick={() => setSelectedTerm(term)}
                            className={`cursor-pointer px-4 py-2 h-15 w-full text-lg font-medium shadow ${selectedTerm === term
                                ? "bg-white text-black"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                        >
                            {term}
                        </button>
                    ))}
                </div>

                {/* Table or fallback */}
                <div className="overflow-x-auto">
                    {filtered.length > 0 ? (
                        <table className="w-full text-left border">
                            <thead>
                                <tr className="text-sm text-gray-600">
                                    <th className="py-3 px-4">Section</th>
                                    <th className="py-3 px-4">Class</th>
                                    <th className="py-3 px-4">Days</th>
                                    <th className="py-3 px-4">Time</th>
                                    <th className="py-3 px-4">Date</th>
                                    <th className="py-3 px-4">Instructor</th>
                                    <th className="py-3 px-4">Location</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((section, index) => (
                                    <tr key={section.classNumber} className={`text-sm border ${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}>
                                        <td className="py-2 px-4">
                                            {section.section.split('\n')[0]}
                                        </td>
                                        <td className="py-2 px-4">{section.classNumber}</td>
                                        <td className="py-2 px-4">
                                            {["Mo", "Tu", "We", "Th", "Fri", "S", "Su"].map((day, index) => (
                                                <span
                                                    key={index}
                                                    className={section.time.includes(day) ? "font-bold" : "text-gray-400"}
                                                >
                                                    {day}{" "}
                                                </span>
                                            ))}
                                        </td>
                                        <td className="py-2 px-4">{section.time.split(" ").slice(1)}</td>
                                        <td className="py-2 px-4">
                                            {section.startDate && section.endDate
                                                ? `${new Date(section.startDate).toLocaleDateString()} - ${new Date(
                                                    section.endDate
                                                ).toLocaleDateString()}`
                                                : "TBA"}
                                        </td>

                                        <td className="py-2 px-4"><Link href={`/professor/${section.instructor}`} className="underline text-[#CC0066]">{section.instructor}</Link></td>
                                        <td className="py-2 px-4">{section.location}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-gray-600 text-sm py-4 px-2 border rounded-md bg-gray-50">
                            No sections found for {selectedTerm}.
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
};
