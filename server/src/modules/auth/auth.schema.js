import { z } from "zod"

export const registerSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" }),

  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" }),

  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" }),

  email: z
    .string()
    .email({ message: "Please enter a valid email address" }),

  password: z
    .string()
    .min(8, { message: "Password must contain at least 8 characters" }),

  gender: z.enum(["male", "female", "other"], {
    errorMap: () => ({ message: "Invalid gender selection" }),
  }),
})

export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address" }),

  password: z
  .string()
  .min(8, { message: "Password must contain at least 8 characters" })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
  .regex(/[0-9]/, { message: "Password must contain at least one number" })
  .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
})

export const verifySchema = z.object({
  token: z
    .string()
    .min(10, { message: "Invalid verification token" }),
})

export const resendVerificationSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address" }),
})

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address" }),
});

export const resetPasswordSchema = z.object({
  token: z
    .string()
    .min(10, { message: "Invalid reset token" }),

  password: z
    .string()
    .min(8, { message: "Password must contain at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
});