/*
  Warnings:

  - You are about to drop the column `allowGuests` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `allowUnverified` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `allowGuests`,
    DROP COLUMN `allowUnverified`,
    ADD COLUMN `profileVisibility` ENUM('public', 'members', 'verified') NOT NULL DEFAULT 'public';
