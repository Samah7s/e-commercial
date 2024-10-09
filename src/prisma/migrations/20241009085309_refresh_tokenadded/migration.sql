-- AlterTable
ALTER TABLE `sessions` MODIFY `user_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `refresh_token` VARCHAR(191) NULL;
