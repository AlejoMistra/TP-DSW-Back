/*
  Warnings:

  - You are about to drop the column `instructorId` on the `class_schedules` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `class_sessions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[instructorId,date,startTime]` on the table `class_sessions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `class_schedules` DROP FOREIGN KEY `class_schedules_instructorId_fkey`;

-- DropForeignKey
ALTER TABLE `class_sessions` DROP FOREIGN KEY `class_sessions_classScheduleId_fkey`;

-- DropIndex
DROP INDEX `class_schedules_instructorId_idx` ON `class_schedules`;

-- DropIndex
DROP INDEX `class_schedules_name_instructorId_key` ON `class_schedules`;

-- DropIndex
DROP INDEX `class_sessions_classScheduleId_date_startTime_key` ON `class_sessions`;

-- AlterTable
ALTER TABLE `class_schedules` DROP COLUMN `instructorId`;

-- AlterTable
ALTER TABLE `class_sessions` DROP COLUMN `endTime`,
    ADD COLUMN `instructorId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `class_sessions_instructorId_date_startTime_key` ON `class_sessions`(`instructorId`, `date`, `startTime`);

-- AddForeignKey
ALTER TABLE `class_sessions` ADD CONSTRAINT `class_sessions_instructorId_fkey` FOREIGN KEY (`instructorId`) REFERENCES `instructors`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
