/*
  Warnings:

  - A unique constraint covering the columns `[classNumber,term]` on the table `CourseSection` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "CourseSection_classNumber_key";

-- CreateIndex
CREATE UNIQUE INDEX "CourseSection_classNumber_term_key" ON "CourseSection"("classNumber", "term");
