/*
  Warnings:

  - You are about to drop the column `contactEmailVisible` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `contactEmailVisible`,
    ADD COLUMN `profileVisibility` ENUM('public_all', 'public_verified', 'public_logged_in', 'private') NOT NULL DEFAULT 'public_all';
