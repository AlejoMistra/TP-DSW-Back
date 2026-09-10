/*
  Warnings:

  - The values [SUSPENDED,PENDING] on the enum `memberships_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `memberships` MODIFY `status` ENUM('ACTIVE', 'CANCELLED', 'EXPIRED') NOT NULL DEFAULT 'ACTIVE';
