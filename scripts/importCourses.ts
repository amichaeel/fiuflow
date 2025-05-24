import fs from 'fs'
import csv from 'csv-parser'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const courses: { career: any; code: any; college: any; courseNumber: any; creditsAcademicProgress: number; description: any; effectiveStartDate: Date | null; effectiveEndDate: Date | null; longName: any; name: any; status: any; subjectCode: any }[] = []

    fs.createReadStream('data/summer25/courses.csv')
        .pipe(csv())
        .on('data', (row) => {
            courses.push({
                career: row.career,
                code: row.code,
                college: row.college,
                courseNumber: row.courseNumber,
                creditsAcademicProgress: parseFloat(row.credits_academicProgressHours_value || 0),
                description: row.description || '',
                effectiveStartDate: row.effectiveStartDate ? new Date(row.effectiveStartDate) : null,
                effectiveEndDate: row.effectiveEndDate ? new Date(row.effectiveEndDate) : null,
                longName: row.longName,
                name: row.name,
                status: row.status,
                subjectCode: row.subjectCode,
            })
        })
        .on('end', async () => {
            await prisma.course.createMany({ data: courses })
            console.log('Imported courses!')
            process.exit()
        })
}

main().catch((e) => {
    console.error(e)
    process.exit(1)
})
