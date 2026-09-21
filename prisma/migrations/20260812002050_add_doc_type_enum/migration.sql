/*
  Warnings:

  - You are about to alter the column `docType` on the `members` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `members` MODIFY `docType` ENUM('DNI', 'PASAPORTE') NOT NULL DEFAULT 'DNI';
