/*
  Warnings:

  - You are about to drop the column `image` on the `members` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `members` DROP COLUMN `image`,
    ALTER COLUMN `birthDate` DROP DEFAULT;
