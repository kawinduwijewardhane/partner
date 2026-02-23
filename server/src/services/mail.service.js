import nodemailer from "nodemailer"
import { env } from "../config/env.js"

const transporter = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS
  },
  authMethod: "LOGIN",
  tls: {
    rejectUnauthorized: false
  }
})

export const sendVerificationEmail = async (email, token) => {
  const link = `${env.FRONTEND_VERIFY_URL}?token=${token}`
  await transporter.sendMail({
    from: env.EMAIL_FROM,
    to: email,
    subject: "Verify your email",
    html: `<p>Click the link to verify your account:</p><a href="${link}">${link}</a>`
  })
}