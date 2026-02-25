import crypto from "crypto";
import argon2 from "argon2";
import { prisma } from "../../core/prisma.js";
import {
  sendResetPasswordEmail,
  sendVerificationEmail,
} from "../../services/mail.service.js";
import { AppError } from "../../core/AppError.js";
import { generateProfileQR } from "../../utils/qr.js";

export const generateAccessToken = (app, user) =>
  app.jwt.sign(
    {
      userId: user.id,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      tokenVersion: user.tokenVersion,
    },
    { expiresIn: "15m" },
  );

export const generateRefreshToken = async (userId) => {
  const raw = crypto.randomBytes(64).toString("hex");
  const hash = crypto.createHash("sha256").update(raw).digest("hex");

  await prisma.refreshToken.create({
    data: {
      tokenHash: hash,
      userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return raw;
};

export const rotateRefreshToken = async (oldToken) => {
  const hash = crypto.createHash("sha256").update(oldToken).digest("hex");

  const record = await prisma.refreshToken.findFirst({
    where: { tokenHash: hash },
  });

  if (!record) return null;
  if (record.expiresAt < new Date()) return null;

  await prisma.refreshToken.delete({
    where: { id: record.id },
  });

  const newToken = await generateRefreshToken(record.userId);

  return {
    userId: record.userId,
    refreshToken: newToken,
  };
};

export const registerUser = async (data) => {
  const exists = await prisma.user.findFirst({
    where: {
      OR: [{ email: data.email }, { username: data.username }],
    },
  });

  if (exists) {
    if (exists.email === data.email) {
      throw new AppError("This email is already registered", 409);
    }
    if (exists.username === data.username) {
      throw new AppError("This username is already taken", 409);
    }
  }

  const passwordHash = await argon2.hash(data.password);

  let defaultAvatar;

  switch (data.gender) {
    case "male":
      defaultAvatar = "https://cdn.inst.lk/relationship/site/images/groom.webp";
      break;

    case "female":
      defaultAvatar = "https://cdn.inst.lk/relationship/site/images/bride.webp";
      break;

    default:
      defaultAvatar =
        "https://cdn.inst.lk/relationship/site/images/default.webp";
      break;
  }

  const user = await prisma.user.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      email: data.email,
      passwordHash,
      gender: data.gender,
      avatarUrl: defaultAvatar,
    },
  });

  await generateProfileQR(user.id, user.username);

  const token = crypto.randomBytes(32).toString("hex");

  await prisma.emailVerificationToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt: new Date(Date.now() + 3600000),
    },
  });

  await sendVerificationEmail(user.email, token);

  return user;
};

export const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  const FAKE_HASH =
    "$argon2id$v=19$m=65536,t=3,p=1$abcdefghijklmnopqrstuvwxyz$abcdefghijklmnopqrstuvwxyz";

  if (!user) {
    await argon2.verify(FAKE_HASH, password).catch(() => {});
    throw new AppError("Invalid email or password", 401);
  }

  const validPassword = await argon2.verify(user.passwordHash, password);

  if (!validPassword) {
    throw new AppError("Invalid email or password", 401);
  }

  if (user.isBanned) {
    throw new AppError("Your account has been suspended", 403);
  }

  return user;
};

export const resendVerificationEmail = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return;
  }

  if (user.isEmailVerified) {
    return;
  }

  await prisma.emailVerificationToken.deleteMany({
    where: { userId: user.id },
  });

  const token = crypto.randomBytes(32).toString("hex");

  await prisma.emailVerificationToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt: new Date(Date.now() + 3600000),
    },
  });

  await sendVerificationEmail(user.email, token);
};

export const requestPasswordReset = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) return;
  if (user.isBanned) return;

  await prisma.resetPasswordToken.deleteMany({
    where: { userId: user.id },
  });

  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  await prisma.resetPasswordToken.create({
    data: {
      tokenHash,
      userId: user.id,
      expiresAt: new Date(Date.now() + 3600000),
    },
  });

  await sendResetPasswordEmail(user.email, rawToken);
};

export const resetPassword = async (token, newPassword) => {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const record = await prisma.resetPasswordToken.findUnique({
    where: { tokenHash },
  });

  if (!record || record.expiresAt < new Date()) {
    throw new AppError("Invalid or expired reset token", 400);
  }

  const passwordHash = await argon2.hash(newPassword);

  await prisma.user.update({
    where: { id: record.userId },
    data: {
      passwordHash,
      tokenVersion: { increment: 1 },
    },
  });

  await prisma.resetPasswordToken.delete({
    where: { id: record.id },
  });
};
