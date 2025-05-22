import fs from 'fs'
import csv from 'csv-parser'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const professors: { name: string }[] = []

    fs.createReadStream('data/professors.csv')
        .pipe(csv())
        .on('data', (row) => {
            if (row.instructor) {
                professors.push({ name: row.instructor })
            }
        })
        .on('end', async () => {
            try {
                await prisma.professor.createMany({
                    data: professors,
                    skipDuplicates: true,
                })
                console.log(`Imported ${professors.length} professors!`)
            } catch (e) {
                console.error("Error inserting into DB:", e)
            } finally {
                await prisma.$disconnect()
                process.exit()
            }
        })
}

main().catch((e) => {
    console.error(e)
    process.exit(1)
})
