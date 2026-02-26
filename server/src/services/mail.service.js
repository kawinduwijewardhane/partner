import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const transporter = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
  authMethod: "LOGIN",
});

const baseTemplate = ({ title, message, buttonText, buttonUrl }) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
  </head>
  <body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;background:#f5f5f5;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;">
            
            <tr>
              <td style="background:#111;padding:24px;text-align:center;">
                <h1 style="margin:0;color:#ffffff;font-size:20px;">
                  ${env.APP_NAME || "Match"}
                </h1>
              </td>
            </tr>

            <tr>
              <td style="padding:40px 32px;">
                <h2 style="margin:0 0 16px 0;color:#111;font-size:22px;">
                  ${title}
                </h2>

                <p style="margin:0 0 24px 0;color:#555;font-size:15px;line-height:1.6;">
                  ${message}
                </p>

                <table cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="center">
                      <a 
                        href="${buttonUrl}" 
                        style="
                          display:inline-block;
                          padding:14px 28px;
                          background:#111;
                          color:#ffffff;
                          text-decoration:none;
                          border-radius:6px;
                          font-weight:bold;
                          font-size:14px;
                        "
                      >
                        ${buttonText}
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="margin:32px 0 8px 0;color:#888;font-size:13px;">
                  Or copy and paste this link into your browser:
                </p>

                <p style="word-break:break-all;color:#555;font-size:13px;">
                  ${buttonUrl}
                </p>

                <p style="margin-top:24px;color:#999;font-size:12px;line-height:1.6;">
                  If you did not request this email, you can safely ignore it.
                  This link is secure and intended only for you.
                </p>
              </td>
            </tr>

            <tr>
              <td style="background:#fafafa;padding:20px;text-align:center;">
                <p style="margin:0;color:#999;font-size:12px;">
                  © ${new Date().getFullYear()} ${env.APP_NAME || "Match"}.
                  All rights reserved.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};

export const sendVerificationEmail = async (email, token) => {
  const link = `${env.FRONTEND_VERIFY_URL}?token=${token}`;

  await transporter.sendMail({
    from: env.EMAIL_FROM,
    to: email,
    subject: "Verify your email address",
    text: `Verify your account by clicking this link:\n\n${link}\n\nIf you did not request this, ignore this email.`,
    html: baseTemplate({
      title: "Verify Your Email",
      message:
        "Thank you for registering. Please confirm your email address to activate your account.",
      buttonText: "Verify Email",
      buttonUrl: link,
    }),
  });
};

export const sendResetPasswordEmail = async (email, token) => {
  const link = `${env.FRONTEND_RESET_URL}?token=${token}`;

  await transporter.sendMail({
    from: env.EMAIL_FROM,
    to: email,
    subject: "Reset your password",
    text: `You requested a password reset.\n\nThis link expires in 1 hour:\n\n${link}\n\nIf you did not request this, ignore this email.`,
    html: baseTemplate({
      title: "Password Reset",
      message:
        "You requested to reset your password. This link will expire in 1 hour for security reasons.",
      buttonText: "Reset Password",
      buttonUrl: link,
    }),
  });
};