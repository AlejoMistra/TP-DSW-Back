-- Active: 1784863886582@@172.25.24.62@3306
/*
Warnings:

- The values [beginner,intermediate,advanced] on the enum `Exercise_difficultyLevel` will be removed. If these variants are still used in the database, this will fail.
- You are about to drop the column `idNumber` on the `Member` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Member_idNumber_key` ON `Member`;

-- AlterTable
ALTER TABLE `Exercise`
MODIFY `difficultyLevel` ENUM(
    'Principiante',
    'Intermedio',
    'Avanzado'
) NOT NULL;

-- AlterTable
ALTER TABLE `Member` DROP COLUMN `idNumber`;

-- CreateTable
CREATE TABLE `Instructor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `surname` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `joinDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    UNIQUE INDEX `Instructor_email_key` (`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Membership` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `startDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `endDate` DATETIME(3) NOT NULL,
    `status` ENUM(
        'Activo',
        'Vencido',
        'Cancelado'
    ) NOT NULL DEFAULT 'Activo',
    `lastPaymentMethod` ENUM(
        'Transferencia',
        'Efectivo',
        'Tarjeta',
        'Otro'
    ) NOT NULL,
    `lastAmountPaid` DOUBLE NOT NULL,
    `memberId` INTEGER NOT NULL,
    `membershipPlanId` INTEGER NOT NULL,
    UNIQUE INDEX `Membership_memberId_key` (`memberId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MembershipPlan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `price` DOUBLE NOT NULL,
    `durationDays` INTEGER NOT NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Membership`
ADD CONSTRAINT `Membership_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `Member` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Membership`
ADD CONSTRAINT `Membership_membershipPlanId_fkey` FOREIGN KEY (`membershipPlanId`) REFERENCES `MembershipPlan` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;