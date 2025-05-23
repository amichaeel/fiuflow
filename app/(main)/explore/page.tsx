'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import React from "react";
import CourseList from "@/components/CourseList";
import ProfessorList from "@/components/ProfessorList";

const COURSE_LEVELS = [
    { label: "1XXX", value: "1" },
    { label: "2XXX", value: "2" },
    { label: "3XXX", value: "3" },
    { label: "4XXX", value: "4" },
    { label: "5XXX+", value: "5" },
];

export default function Explore() {
    const [courseLevel, setCourseLevel] = React.useState("1xxx");
    const [minRatings, setMinRatings] = React.useState(0);
    const [offeredTerms, setOfferedTerms] = React.useState<string[]>([]);
    const [noPrereqs, setNoPrereqs] = React.useState(false);

    function handleTermChange(term: string) {
        setOfferedTerms((prev) =>
            prev.includes(term)
                ? prev.filter((t) => t !== term)
                : [...prev, term]
        );
    }

    function clearFilters() {
        setCourseLevel("1xxx");
        setMinRatings(0);
        setOfferedTerms([]);
        setNoPrereqs(false);
    }

    return (
        <main>
            <div
                className="flex justify-end pt-18 pb-4 bg-[#001d4a]"
                style={{
                    backgroundImage: "url('statue.jpg')",
                    backgroundSize: "cover",
                    backgroundBlendMode: "overlay",
                    backgroundPositionY: "30%",

                }}
            >
                <div className="container max-w-6xl px-4 mx-auto flex">
                    <span className="font-semibold text-4xl text-white">Showing all courses and professors</span>
                </div>
            </div>
            <div className="container mx-auto w-full max-w-6xl items-center px-4 py-8">
                <div className="flex flex-col-reverse md:flex-row gap-4">
                    <Tabs defaultValue="courses" className="!gap-0 w-full">
                        <TabsList className="w-full">
                            <TabsTrigger value="courses">Courses</TabsTrigger>
                            <TabsTrigger value="professors">Professors</TabsTrigger>
                        </TabsList>
                        <TabsContent value="courses">
                            <CourseList />
                        </TabsContent>
                        <TabsContent value="professors">
                            <ProfessorList />
                        </TabsContent>
                    </Tabs>
                    <aside className="md:w-80 w-full shrink-0">
                        <div className="bg-white shadow w-full p-6 sticky top-20">
                            <h2 className="font-semibold text-lg mb-6">Filter your results</h2>
                            {/* Course code */}
                            <div className="mb-6">
                                <div className="font-medium mb-2">Course code</div>
                                <div className="flex flex-wrap gap-2">
                                    {COURSE_LEVELS.map((level) => (
                                        <Button
                                            key={level.value}
                                            variant={courseLevel === level.value ? "default" : "outline"}
                                            size="sm"
                                            className="rounded-full px-4"
                                            onClick={() => setCourseLevel(level.value)}
                                        >
                                            {level.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                            {/* Min # of ratings */}
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium">Min # of ratings</span>
                                    <span className="text-xs text-muted-foreground">
                                        &ge; {minRatings} ratings
                                    </span>
                                </div>
                                <Slider
                                    min={0}
                                    max={500}
                                    step={1}
                                    value={[minRatings]}
                                    onValueChange={([val]) => setMinRatings(val)}
                                />
                            </div>
                            {/* Offered in */}
                            <div className="mb-6">
                                <div className="font-medium mb-2">Offered in</div>
                                <div className="flex flex-col gap-2">
                                    <label className="flex items-center gap-2">
                                        <Checkbox
                                            checked={offeredTerms.includes("summer2025")}
                                            onCheckedChange={() => handleTermChange("summer2025")}
                                        />
                                        <span>This term (Spring 2025)</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <Checkbox
                                            checked={offeredTerms.includes("fall2025")}
                                            onCheckedChange={() => handleTermChange("fall2025")}
                                        />
                                        <span>Next term (Fall 2025)</span>
                                    </label>
                                </div>
                            </div>
                            {/* Requirements */}
                            <div className="mb-6">
                                <div className="font-medium mb-2">Requirements</div>
                                <label className="flex items-center gap-2">
                                    <Checkbox
                                        checked={noPrereqs}
                                        onCheckedChange={() => setNoPrereqs((v) => !v)}
                                    />
                                    <span>No prerequisites</span>
                                </label>
                            </div>
                            <Button
                                className="w-full mt-2"
                                variant="default"
                                onClick={clearFilters}
                            >
                                &#10005; Clear filter
                            </Button>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}