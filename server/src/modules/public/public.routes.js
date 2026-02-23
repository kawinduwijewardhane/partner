import { prisma } from "../../core/prisma.js"
import { calculateAge } from "../../utils/age.js"
import { AppError } from "../../core/AppError.js"
import { env } from "../../config/env.js";

export default async function (app) {

  app.get("/user/:username", async (req, reply) => {

    const rawUsername = req.params.username

    if (!rawUsername || typeof rawUsername !== "string") {
      throw new AppError("Invalid username", 400)
    }

    const username = rawUsername.trim().toLowerCase()

    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        ad: true
      }
    })

    if (!user || user.isBanned || !user.ad || user.ad.status !== "active") {
      throw new AppError("Profile not found", 404)
    }

    const age = calculateAge(user.dateOfBirth)

    return reply.send({
      success: true,
      data: {
        username: user.username,
        fullName: user.displayFullName
          ? `${user.firstName} ${user.lastName}`
          : null,
        verified: user.isEmailVerified,
        gender: user.gender,
        age,
        maritalStatus: user.maritalStatus,
        currentJob: user.currentJob,
        bio: user.bio,
        avatarUrl: user.avatarUrl ? `${env.CDN_BASE_URL}/${user.avatarUrl}` : null,
        relationshipType: user.ad.relationshipType,
        adTitle: user.ad.title,
        adDescription: user.ad.description,
        contactEmail: user.contactEmailVisible
          ? user.contactEmail
          : null,
        facebookUrl: user.facebookUrl,
        instagramUrl: user.instagramUrl,
        otherContactMethod: user.otherContactMethod,
        qrCode: `${env.CDN_BASE_URL}/qrcodes/${user.id}.webp`
      }
    })

  })

}