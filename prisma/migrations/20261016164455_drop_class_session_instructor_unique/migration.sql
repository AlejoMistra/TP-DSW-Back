-- DropForeignKey
ALTER TABLE `class_sessions` DROP FOREIGN KEY `class_sessions_instructorId_fkey`;

-- DropIndex
DROP INDEX `class_sessions_instructorId_date_startTime_key` ON `class_sessions`;

-- CreateIndex
CREATE INDEX `class_sessions_instructorId_date_idx` ON `class_sessions`(`instructorId`, `date`);

-- AddForeignKey
ALTER TABLE `class_sessions` ADD CONSTRAINT `class_sessions_instructorId_fkey` FOREIGN KEY (`instructorId`) REFERENCES `instructors`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
