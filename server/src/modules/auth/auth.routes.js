import {
  registerSchema,
  loginSchema,
  verifySchema,
  resendVerificationSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./auth.schema.js";

import {
  registerUser,
  generateAccessToken,
  generateRefreshToken,
  rotateRefreshToken,
  loginUser,
  resendVerificationEmail,
  requestPasswordReset,
  resetPassword,
} from "./auth.service.js";

import { prisma } from "../../core/prisma.js";
import { sanitizeUser } from "../../utils/userSerializer.js";
import { requireAuth } from "../../middlewares/requireAuth.js";
import { AppError } from "../../core/AppError.js";

export default async function (app) {
  app.post("/auth/register", async (req, reply) => {
    const data = registerSchema.parse(req.body);

    const user = await registerUser(data);

    const accessToken = generateAccessToken(app, user);
    const refreshToken = await generateRefreshToken(user.id);

    reply.setCookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      domain: process.env.NODE_ENV === "production" ? ".inst.lk" : undefined,
    });

    reply.setCookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      domain: process.env.NODE_ENV === "production" ? ".inst.lk" : undefined,
    });

    return reply.send({
      success: true,
      data: {
        user: sanitizeUser(user),
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

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const accessToken = generateAccessToken(app, user);

    reply.setCookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      domain: process.env.NODE_ENV === "production" ? ".inst.lk" : undefined,
    });

    return reply.send({
      success: true,
      data: {
        user: sanitizeUser(user),
      },
    });
  });

  app.post(
    "/auth/resend-verification",
    {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: "15 minutes",
        },
      },
    },
    async (req, reply) => {
      const { email } = resendVerificationSchema.parse(req.body);
      await resendVerificationEmail(email);

      return reply.send({
        success: true,
        message:
          "If the email is registered and not verified, a new verification link has been sent.",
      });
    },
  );

  app.post("/auth/login", async (req, reply) => {
    const { email, password } = loginSchema.parse(req.body);

    const user = await loginUser(email, password);

    const accessToken = generateAccessToken(app, user);
    const refreshToken = await generateRefreshToken(user.id);

    reply.setCookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      domain: process.env.NODE_ENV === "production" ? ".inst.lk" : undefined,
    });

    reply.setCookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      domain: process.env.NODE_ENV === "production" ? ".inst.lk" : undefined,
    });

    return reply.send({
      success: true,
      data: {
        user: sanitizeUser(user),
      },
    });
  });

  app.get("/auth/me", { preHandler: requireAuth }, async (req, reply) => {
    return reply.send({
      success: true,
      data: {
        user: sanitizeUser(req.user),
      },
    });
  });

  app.post("/auth/refresh", async (req, reply) => {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      throw new AppError("No refresh token", 401);
    }

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
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      domain: process.env.NODE_ENV === "production" ? ".inst.lk" : undefined,
    });

    reply.setCookie("refresh_token", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      domain: process.env.NODE_ENV === "production" ? ".inst.lk" : undefined,
    });

    return reply.send({
      success: true,
      data: {
        user: sanitizeUser(user),
      },
    });
  });

  app.post("/auth/logout", async (req, reply) => {
    reply.clearCookie("access_token", { path: "/" });
    reply.clearCookie("refresh_token", { path: "/" });

    return reply.send({
      success: true,
      data: null,
    });
  });

  app.post(
    "/auth/forgot-password",
    {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: "15 minutes",
        },
      },
    },
    async (req, reply) => {
      const { email } = forgotPasswordSchema.parse(req.body);

      await requestPasswordReset(email);

      return reply.send({
        success: true,
        message:
          "If the email is registered, a password reset link has been sent.",
      });
    },
  );

  app.post(
    "/auth/reset-password",
    {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: "15 minutes",
        },
      },
    },
    async (req, reply) => {
      const { token, password } = resetPasswordSchema.parse(req.body);

      await resetPassword(token, password);

      return reply.send({
        success: true,
        message: "Password has been reset successfully",
      });
    },
  );
}