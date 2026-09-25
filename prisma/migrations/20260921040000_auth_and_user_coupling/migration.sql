-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NULL,
    `accountStatus` ENUM(
        'PENDING_ACTIVATION',
        'ACTIVE',
        'SUSPENDED'
    ) NOT NULL DEFAULT 'PENDING_ACTIVATION',
    `role` ENUM(
        'ADMIN',
        'INSTRUCTOR',
        'MEMBER'
    ) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `failedLoginAttempts` INTEGER NOT NULL DEFAULT 0,
    `lockedUntil` DATETIME(3) NULL,
    `lastLoginAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NULL,
    UNIQUE INDEX `users_email_key` (`email`),
    INDEX `users_role_isActive_idx` (`role`, `isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AlterTable
ALTER TABLE `instructors`
ADD COLUMN `userId` INTEGER NULL,
ADD COLUMN `docType` ENUM('DNI', 'PASAPORTE') NOT NULL DEFAULT 'DNI',
ADD COLUMN `docNumber` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `members` ADD COLUMN `userId` INTEGER NULL;

-- Backfill Users from Members
INSERT INTO
    `users` (
        `email`,
        `role`,
        `accountStatus`,
        `isActive`,
        `createdAt`,
        `updatedAt`
    )
SELECT `email`, 'MEMBER', 'PENDING_ACTIVATION', true, NOW(3), NOW(3)
FROM `members`
WHERE
    `email` IS NOT NULL;

-- Link Members to Users
UPDATE `members` m
JOIN `users` u ON m.`email` = u.`email`
SET
    m.`userId` = u.`id`;

-- Backfill Users from Instructors
INSERT INTO
    `users` (
        `email`,
        `role`,
        `accountStatus`,
        `isActive`,
        `createdAt`,
        `updatedAt`
    )
SELECT `email`, 'INSTRUCTOR', 'PENDING_ACTIVATION', true, NOW(3), NOW(3)
FROM `instructors`
WHERE
    `email` IS NOT NULL
    AND `email` NOT IN(
        SELECT `email`
        FROM `users`
    );

-- Link Instructors to Users
UPDATE `instructors` i
JOIN `users` u ON i.`email` = u.`email`
SET
    i.`userId` = u.`id`;

-- AlterTable Members: drop email, make userId required
ALTER TABLE `members`
DROP COLUMN `email`,
MODIFY `userId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `members_userId_key` ON `members` (`userId`);

-- AddForeignKey
ALTER TABLE `members`
ADD CONSTRAINT `members_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AlterTable Instructors: drop email, make userId required
ALTER TABLE `instructors`
DROP COLUMN `email`,
MODIFY `userId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `instructors_userId_key` ON `instructors` (`userId`);

-- AddForeignKey
ALTER TABLE `instructors`
ADD CONSTRAINT `instructors_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;