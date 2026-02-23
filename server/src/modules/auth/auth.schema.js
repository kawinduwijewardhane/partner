import { z } from "zod"

export const registerSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  gender: z.enum(["male", "female", "other"])
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export const verifySchema = z.object({
  token: z.string().min(10)
})

export const refreshSchema = z.object({
  refreshToken: z.string().min(20)
})