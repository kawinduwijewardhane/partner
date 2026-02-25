import nodemailer from "nodemailer";
import { env } from "../config/env.js";

console.log(env.FRONTEND_RESET_URL)

const transporter = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
  authMethod: "LOGIN",
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendVerificationEmail = async (email, token) => {
  const link = `${env.FRONTEND_VERIFY_URL}?token=${token}`;

  await transporter.sendMail({
    from: env.EMAIL_FROM,
    to: email,
    subject: "Verify your email",
    html: `
      <p>Click the link to verify your account:</p>
      <a href="${link}">${link}</a>
    `,
  });
};

export const sendResetPasswordEmail = async (email, token) => {
  const link = `${env.FRONTEND_RESET_URL}?token=${token}`;

  await transporter.sendMail({
    from: env.EMAIL_FROM,
    to: email,
    subject: "Reset your password",
    html: `
      <h2>Password Reset Request</h2>
      <p>You requested to reset your password.</p>
      <p>This link will expire in 1 hour.</p>
      <a href="${link}" style="display:inline-block;padding:10px 16px;background:#111;color:#fff;text-decoration:none;border-radius:6px;">
        Reset Password
      </a>
      <p>If you did not request this, please ignore this email.</p>
    `,
  });
};