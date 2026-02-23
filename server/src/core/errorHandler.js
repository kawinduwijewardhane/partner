import { ZodError } from "zod"
import { Prisma } from "@prisma/client"
import { AppError } from "./AppError.js"

export const errorHandler = (error, req, reply) => {

  const isDev = process.env.NODE_ENV !== "production"

  if (isDev) {
    console.error("ERROR:", error)
  } else {
    console.error({
      message: error.message,
      code: error.code,
      path: req.url,
      method: req.method
    })
  }

  if (error instanceof AppError) {
    return reply.code(error.statusCode).send({
      success: false,
      message: error.message,
      errors: error.errors || null
    })
  }

  if (error instanceof ZodError) {
    return reply.code(400).send({
      success: false,
      message: "Validation failed",
      errors: error.errors.map(e => ({
        field: e.path.join("."),
        message: e.message
      }))
    })
  }

  if (error.validation) {
    return reply.code(400).send({
      success: false,
      message: "Validation failed",
      errors: error.validation
    })
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {

    if (error.code === "P2002") {
      return reply.code(409).send({
        success: false,
        message: "Duplicate value"
      })
    }

    if (error.code === "P2025") {
      return reply.code(404).send({
        success: false,
        message: "Resource not found"
      })
    }

    return reply.code(400).send({
      success: false,
      message: "Database operation failed"
    })
  }

  if (
    error.code === "FST_JWT_NO_AUTHORIZATION_IN_HEADER" ||
    error.code === "FST_JWT_AUTHORIZATION_TOKEN_EXPIRED" ||
    error.code === "FST_JWT_AUTHORIZATION_TOKEN_INVALID"
  ) {
    return reply.code(401).send({
      success: false,
      message: "Unauthorized"
    })
  }

  if (error.statusCode === 429) {
    return reply.code(429).send({
      success: false,
      message: "Too many requests"
    })
  }

  if (error.code === "FST_FILES_LIMIT") {
    return reply.code(400).send({
      success: false,
      message: "File too large"
    })
  }

  return reply.code(500).send({
    success: false,
    message: isDev ? error.message : "Internal server error"
  })
}