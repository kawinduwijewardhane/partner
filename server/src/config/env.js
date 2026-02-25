import dotenv from "dotenv"
dotenv.config()

export const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  COOKIE_SECRET: process.env.COOKIE_SECRET,
  CLIENT_URL: process.env.CLIENT_URL,
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: process.env.EMAIL_PORT,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  EMAIL_FROM: process.env.EMAIL_FROM,
  FRONTEND_VERIFY_URL: process.env.FRONTEND_VERIFY_URL,
  FRONTEND_RESET_URL: process.env.FRONTEND_RESET_URL,
  CDN_SSH_HOST: process.env.CDN_SSH_HOST,
  CDN_SSH_USER: process.env.CDN_SSH_USER,
  CDN_UPLOAD_PATH: process.env.CDN_UPLOAD_PATH,
  CDN_BASE_URL: process.env.CDN_BASE_URL,
}