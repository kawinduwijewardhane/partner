/*
  Warnings:

  - You are about to drop the column `profileVisibility` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `profileVisibility`,
    ADD COLUMN `allowGuests` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `allowUnverified` BOOLEAN NOT NULL DEFAULT true;
