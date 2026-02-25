import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { AppError } from "./AppError.js";

export const errorHandler = (error, req, reply) => {
  const isDev = process.env.NODE_ENV !== "production";

  const logPayload = {
    message: error?.message || "Unknown error",
    name: error?.name,
    code: error?.code,
    statusCode: error?.statusCode,
    path: req?.url,
    method: req?.method,
    ip: req?.ip,
    stack: isDev ? error?.stack : undefined,
  };

  // console.error("SERVER_ERROR:", logPayload)

  if (error instanceof AppError) {
    return reply.code(error.statusCode).send({
      success: false,
      message: error.message,
      errors: error.errors || null,
    });
  }

  if (error instanceof ZodError) {
    const firstError = error.errors?.[0];

    return reply.code(400).send({
      success: false,
      message: firstError?.message || "Validation failed",
      field: firstError?.path?.join(".") || null,
    });
  }

  if (error?.validation) {
    return reply.code(400).send({
      success: false,
      message: "Validation failed",
      errors: error.validation,
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return reply.code(409).send({
          success: false,
          message: "Duplicate value detected",
        });

      case "P2025":
        return reply.code(404).send({
          success: false,
          message: "Resource not found",
        });

      default:
        return reply.code(400).send({
          success: false,
          message: "Database operation failed",
        });
    }
  }

  if (
    error?.code === "FST_JWT_NO_AUTHORIZATION_IN_HEADER" ||
    error?.code === "FST_JWT_AUTHORIZATION_TOKEN_EXPIRED" ||
    error?.code === "FST_JWT_AUTHORIZATION_TOKEN_INVALID"
  ) {
    return reply.code(401).send({
      success: false,
      message: "Unauthorized",
    });
  }

  if (error?.statusCode === 429) {
    return reply.code(429).send({
      success: false,
      message: "Too many requests",
    });
  }

  if (error?.code === "FST_FILES_LIMIT") {
    return reply.code(400).send({
      success: false,
      message: "File too large",
    });
  }

  return reply.code(500).send({
    success: false,
    message: isDev
      ? error?.message || "Internal server error"
      : "Internal server error",
  });
};
