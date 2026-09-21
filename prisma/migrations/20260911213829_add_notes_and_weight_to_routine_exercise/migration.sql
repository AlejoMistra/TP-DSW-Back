-- AlterTable
ALTER TABLE `routine_exercises` ADD COLUMN `notes` VARCHAR(191) NULL,
    ADD COLUMN `weight` DOUBLE NULL;

-- AddForeignKey
ALTER TABLE `class_sessions` ADD CONSTRAINT `class_sessions_classScheduleId_fkey` FOREIGN KEY (`classScheduleId`) REFERENCES `class_schedules`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
