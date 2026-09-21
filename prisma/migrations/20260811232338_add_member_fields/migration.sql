/*
  Warnings:

  - You are about to drop the column `joinDate` on the `members` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `members` DROP COLUMN `joinDate`,
    ADD COLUMN `birthDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `docNumber` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `docType` VARCHAR(191) NOT NULL DEFAULT 'DNI';
