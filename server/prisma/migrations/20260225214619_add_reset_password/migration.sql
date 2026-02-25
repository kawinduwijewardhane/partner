-- RedefineIndex
CREATE INDEX `ResetPasswordToken_userId_idx` ON `ResetPasswordToken`(`userId`);
DROP INDEX `ResetPasswordToken_userId_fkey` ON `resetpasswordtoken`;
