/*
Warnings:

- You are about to drop the column `lastAmountPaid` on the `memberships` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `memberships`
CHANGE COLUMN `lastAmountPaid` `lastPaymentAmount` DECIMAL(65, 30) NULL,
ADD COLUMN `lastPaymentDate` DATETIME(3) NULL,
MODIFY `lastPaymentMethod` ENUM(
    'CREDIT_CARD',
    'DEBIT_CARD',
    'TRANSFER',
    'CASH',
    'OTHER'
) NULL;