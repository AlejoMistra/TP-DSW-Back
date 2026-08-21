/*
  Warnings:

  - A unique constraint covering the columns `[name,instructorId]` on the table `class_schedules` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `class_schedules_name_instructorId_key` ON `class_schedules`(`name`, `instructorId`);
