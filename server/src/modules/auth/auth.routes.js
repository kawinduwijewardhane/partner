import {
  registerSchema,
  loginSchema,
  verifySchema,
  refreshSchema,
} from "./auth.schema.js";

import {
  registerUser,
  generateAccessToken,
  generateRefreshToken,
  rotateRefreshToken,
  loginUser,
} from "./auth.service.js";

import { prisma } from "../../core/prisma.js";
import { sanitizeUser } from "../../utils/userSerializer.js";

export default async function (app) {
  app.post("/auth/register", async (req, reply) => {
    const data = registerSchema.parse(req.body);

    const user = await registerUser(data);

    const accessToken = generateAccessToken(app, user);
    const refreshToken = await generateRefreshToken(user.id);

    reply.setCookie("access_token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });

    return reply.send({
      success: true,
      data: {
        user: sanitizeUser(user),
        refreshToken,
      },
    });
  });

  app.post("/auth/verify-email", async (req, reply) => {
    const { token } = verifySchema.parse(req.body);

    const record = await prisma.emailVerificationToken.findUnique({
      where: { token },
    });

    if (!record || record.expiresAt < new Date()) {
      throw new AppError("Invalid or expired verification token", 400);
    }

    await prisma.user.update({
      where: { id: record.userId },
      data: { isEmailVerified: true },
    });

    await prisma.emailVerificationToken.delete({
      where: { id: record.id },
    });

    const user = await prisma.user.findUnique({
      where: { id: record.userId },
    });

    return reply.send({
      success: true,
      data: {
        user: sanitizeUser(user),
      },
    });
  });

  app.post("/auth/login", async (req, reply) => {
    const { email, password } = loginSchema.parse(req.body);

    const user = await loginUser(email, password);

    const accessToken = generateAccessToken(app, user);
    const refreshToken = await generateRefreshToken(user.id);

    reply.setCookie("access_token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });

    return reply.send({
      success: true,
      data: {
        user: sanitizeUser(user),
        refreshToken,
      },
    });
  });

  app.post("/auth/refresh", async (req, reply) => {
    const { refreshToken } = refreshSchema.parse(req.body);

    const result = await rotateRefreshToken(refreshToken);

    if (!result) {
      throw new AppError("Invalid or expired refresh token", 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: result.userId },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const accessToken = generateAccessToken(app, user);

    reply.setCookie("access_token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });

    return reply.send({
      success: true,
      data: {
        user: sanitizeUser(user),
        refreshToken: result.refreshToken,
      },
    });
  });

  app.post("/auth/logout", async (req, reply) => {
    reply.clearCookie("access_token");
    return reply.send({
      success: true,
      data: null,
    });
  });
}
