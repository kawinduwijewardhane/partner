import { prisma } from "../../core/prisma.js";
import { calculateAge } from "../../utils/age.js";
import { AppError } from "../../core/AppError.js";
import { env } from "../../config/env.js";
import crypto from "crypto";

async function optionalAuth(req, reply) {
  try {
    await req.jwtVerify();
  } catch {}
}

function hashIP(ip) {
  return crypto.createHash("sha256").update(ip).digest("hex");
}

export default async function (app) {
  app.get(
    "/user/:username",
    { preHandler: optionalAuth },
    async (req, reply) => {
      const rawUsername = req.params.username;

      if (!rawUsername || typeof rawUsername !== "string") {
        throw new AppError("Invalid username", 400);
      }

      const username = rawUsername.trim().toLowerCase();

      const user = await prisma.user.findUnique({
        where: { username },
        include: { ad: true },
      });

      if (!user) {
        throw new AppError("Profile not found", 404);
      }

      // Ban check
      if (
        user.isBanned ||
        (user.bannedUntil && user.bannedUntil > new Date())
      ) {
        throw new AppError("Profile not found", 404);
      }

      const viewer = req.user || null;
      const viewerId = viewer?.userId || null;
      const isSelfView = viewerId && viewerId === user.id;

      // Ad visibility check
      if (!isSelfView) {
        if (!user.ad || user.ad.status !== "active") {
          throw new AppError("Profile not found", 404);
        }
      }

      // Profile visibility rules
      if (!isSelfView) {
        const visibility = user.profileVisibility || "public";

        switch (visibility) {
          case "public":
            break;

          case "members":
            if (!viewer) {
              throw new AppError("Profile not found", 404);
            }
            break;

          case "verified":
            if (!viewer || !viewer.isVerified) {
              throw new AppError("Profile not found", 404);
            }
            break;

          default:
            break;
        }
      }

      // Profile view counting
      let updatedViewsCount = user.profileViewsCount;

      if (!isSelfView) {
        const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);

        const realIP =
          req.headers["x-forwarded-for"]?.split(",")[0] || req.ip;

        const ipHash = viewerId ? null : hashIP(realIP);

        const existingView = await prisma.profileView.findFirst({
          where: {
            userId: user.id,
            OR: [
              viewerId ? { viewerId } : undefined,
              !viewerId ? { ipHash } : undefined,
            ].filter(Boolean),
            createdAt: { gte: sixHoursAgo },
          },
        });

        if (!existingView) {
          await prisma.$transaction([
            prisma.profileView.create({
              data: {
                userId: user.id,
                viewerId,
                ipHash,
              },
            }),
            prisma.user.update({
              where: { id: user.id },
              data: {
                profileViewsCount: { increment: 1 },
              },
            }),
          ]);

          updatedViewsCount += 1;
        }
      }

      const age = calculateAge(user.dateOfBirth);
      const shareUrl = `${env.CLIENT_URL}/user/${user.username}`;

      return reply.send({
        success: true,
        data: {
          username: user.username,

          fullName: user.displayFullName
            ? `${user.firstName} ${user.lastName}`
            : null,

          verified: user.isVerified,
          verificationLevel: user.isVerified ? "trusted" : "none",

          gender: user.gender,
          age,
          maritalStatus: user.maritalStatus,
          currentJob: user.currentJob || null,
          bio: user.bio || null,

          avatarUrl: user.avatarUrl || null,

          relationshipType: user.ad?.relationshipType || null,
          adTitle: user.ad?.title || null,
          adDescription: user.ad?.description || null,

          profileViews: updatedViewsCount,

          contactEmail: user.contactEmail || null,

          facebookUrl: user.facebookUrl || null,
          instagramUrl: user.instagramUrl || null,
          githubUrl: user.githubUrl || null,
          threadsUrl: user.threadsUrl || null,
          linkedinUrl: user.linkedinUrl || null,
          twitterUrl: user.twitterUrl || null,
          youtubeUrl: user.youtubeUrl || null,

          whatsappNumber: user.whatsappNumber || null,
          whatsappLink: user.whatsappNumber
            ? `https://wa.me/${user.whatsappNumber.replace(/\D/g, "")}`
            : null,

          phoneNumber: user.phoneNumber || null,
          otherContactMethod: user.otherContactMethod || null,

          qrCode: `${env.CDN_BASE_URL}/qrcodes/${user.id}.webp`,
          qrCodeDownloadUrl: `${env.CDN_BASE_URL}/qrcodes-download/${user.id}.webp`,
          shareUrl,
        },
      });
    }
  );
}