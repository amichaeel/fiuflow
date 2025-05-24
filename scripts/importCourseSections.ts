import fs from 'fs';
import csv from 'csv-parser';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type RawSection = {
    class: string;
    courseId: string;
    section: string;
    courseName: string;
    time: string;
    location: string;
    instructors: string;
    dates: string;
    campus: string;
};

function inferTermFromSection(section: string): string {
    const summerMatch = section.match(/Summer [A-C]/i);
    const fallMatch = section.match(/Fall/i);
    const springMatch = section.match(/Spring/i);

    if (summerMatch) return `${summerMatch[0]} 2025`;
    if (fallMatch) return `Fall 2025`;
    if (springMatch) return `Spring 2025`;
    return 'Unknown Term';
}

async function main() {
    const rawSections: RawSection[] = [];

    fs.createReadStream('data/fall25/sections.csv')
        .pipe(csv())
        .on('data', (row) => rawSections.push(row as RawSection))
        .on('end', async () => {
            // Step 1: Preload all existing courses
            const existingCourses = await prisma.course.findMany({ select: { id: true, code: true } });
            const courseMap = new Map(existingCourses.map(c => [c.code, c.id]));

            const newCourses: any[] = [];
            const sections: any[] = [];

            // Step 2: Build new courses list
            for (const row of rawSections) {
                const courseCode = row.courseId.trim();
                if (!courseMap.has(courseCode)) {
                    newCourses.push({
                        career: "Undergraduate",
                        code: courseCode,
                        courseNumber: "",
                        college: "Unknown",
                        creditsAcademicProgress: null,
                        description: null,
                        effectiveStartDate: null,
                        effectiveEndDate: null,
                        longName: row.courseName,
                        name: row.courseName,
                        status: "Active",
                        subjectCode: "",
                    });
                }
            }

            // Step 3: Create missing courses
            if (newCourses.length > 0) {
                await prisma.course.createMany({ data: newCourses, skipDuplicates: true });
                const allCourses = await prisma.course.findMany({ select: { id: true, code: true } });
                courseMap.clear();
                allCourses.forEach(c => courseMap.set(c.code, c.id));
            }

            // Step 4: Build section records
            for (const row of rawSections) {
                const courseId = courseMap.get(row.courseId.trim());
                if (!courseId) continue;

                const [startRaw, endRaw] = row.dates.split(' - ').map(str => str.trim());
                const isTBA = !startRaw || !endRaw || startRaw.toUpperCase().includes("TBA") || endRaw.toUpperCase().includes("TBA");
                let startDate: Date | null = null;
                let endDate: Date | null = null;

                if (!isTBA) {
                    const parsedStart = new Date(startRaw);
                    const parsedEnd = new Date(endRaw);

                    if (!isNaN(parsedStart.getTime()) && !isNaN(parsedEnd.getTime())) {
                        startDate = parsedStart;
                        endDate = parsedEnd;
                    } else {
                        console.warn(`⚠️ Skipping malformed date: ${row.dates}`);
                        continue;
                    }
                }

                sections.push({
                    classNumber: row.class,
                    courseId,
                    section: row.section,
                    term: inferTermFromSection(row.section),
                    time: row.time,
                    location: row.location,
                    instructor: row.instructors,
                    startDate,
                    endDate,
                    campus: row.campus,
                });
            }

            // Step 5: Create course sections
            if (sections.length > 0) {
                await prisma.courseSection.createMany({ data: sections, skipDuplicates: true });
                console.log(`✅ Done! Inserted ${sections.length} sections.`);
            } else {
                console.log('⚠️ No sections to insert.');
            }

            process.exit();
        });
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
