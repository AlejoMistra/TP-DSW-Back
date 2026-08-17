/*
  Warnings:

  - You are about to drop the column `dayOfWeek` on the `class_schedules` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `class_schedules` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `class_schedules_dayOfWeek_startTime_idx` ON `class_schedules`;

-- AlterTable
ALTER TABLE `class_schedules` DROP COLUMN `dayOfWeek`,
    DROP COLUMN `startTime`;
