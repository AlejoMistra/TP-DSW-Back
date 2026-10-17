-- AlterTable
ALTER TABLE `class_sessions` ADD COLUMN `recurrenceId` INTEGER NULL;

-- AlterTable
ALTER TABLE `users` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- CreateTable
CREATE TABLE `class_session_recurrences` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `frequency` ENUM('DAILY', 'WEEKLY', 'MONTHLY') NOT NULL,
    `interval` INTEGER NOT NULL DEFAULT 1,
    `daysOfWeek` VARCHAR(191) NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `class_sessions_recurrenceId_idx` ON `class_sessions`(`recurrenceId`);

-- AddForeignKey
ALTER TABLE `class_sessions` ADD CONSTRAINT `class_sessions_recurrenceId_fkey` FOREIGN KEY (`recurrenceId`) REFERENCES `class_session_recurrences`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `class_sessions` ADD CONSTRAINT `class_sessions_recurrenceId_fkey` FOREIGN KEY (`recurrenceId`) REFERENCES `class_session_recurrences`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
