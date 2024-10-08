/*
  Warnings:

  - A unique constraint covering the columns `[sid]` on the table `sessions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `data` to the `sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiresAt` to the `sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sid` to the `sessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `sessions` ADD COLUMN `data` VARCHAR(191) NOT NULL,
    ADD COLUMN `expiresAt` DATETIME(3) NOT NULL,
    ADD COLUMN `sid` VARCHAR(191) NOT NULL,
    MODIFY `active` BOOLEAN NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX `sessions_sid_key` ON `sessions`(`sid`);
