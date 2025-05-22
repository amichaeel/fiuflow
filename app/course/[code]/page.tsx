"use client";

import React from "react";
import { useParams } from "next/navigation";

const CoursePage = () => {
    const params = useParams();
    const code = params?.code;

    if (!code) {
        return <div>Loading...</div>;
    }

    return (
        <main>
            <h1>Course: {code}</h1>
        </main>
    );
};

export default CoursePage;