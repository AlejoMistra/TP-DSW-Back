/*
  Warnings:

  - You are about to drop the column `lastPaymentAmount` on the `memberships` table. All the data in the column will be lost.
  - You are about to drop the column `lastPaymentDate` on the `memberships` table. All the data in the column will be lost.
  - You are about to drop the column `lastPaymentMethod` on the `memberships` table. All the data in the column will be lost.
  - The values [EXPIRED,CANCELED] on the enum `memberships_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `memberships` DROP COLUMN `lastPaymentAmount`,
    DROP COLUMN `lastPaymentDate`,
    DROP COLUMN `lastPaymentMethod`,
    MODIFY `status` ENUM('ACTIVE', 'SUSPENDED', 'CANCELLED', 'PENDING') NOT NULL DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE `payments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `amount` DECIMAL(65, 30) NOT NULL,
    `method` ENUM('CREDIT_CARD', 'DEBIT_CARD', 'TRANSFER', 'CASH', 'OTHER') NOT NULL,
    `paymentDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `periodStart` DATETIME(3) NOT NULL,
    `periodEnd` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,
    `membershipId` INTEGER NOT NULL,

    INDEX `payments_membershipId_idx`(`membershipId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_membershipId_fkey` FOREIGN KEY (`membershipId`) REFERENCES `memberships`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
