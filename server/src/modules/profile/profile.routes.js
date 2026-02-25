import { requireAuth } from "../../middlewares/requireAuth.js";
import { calculateAge } from "../../utils/age.js";
import { updateProfileService } from "./profile.service.js";

export default async function (app) {
  app.patch("/profile", { preHandler: requireAuth }, async (req, reply) => {
    const { updated } = await updateProfileService(req.user.id, req.body);

    return reply.send({
      success: true,
      data: {
        user: {
          id: updated.id,
          firstName: updated.firstName,
          lastName: updated.lastName,
          username: updated.username,
          displayFullName: updated.displayFullName,
          maritalStatus: updated.maritalStatus,
          dateOfBirth: updated.dateOfBirth,
          age: calculateAge(updated.dateOfBirth),
          currentJob: updated.currentJob,
          bio: updated.bio,
          avatarUrl: updated.avatarUrl
            ? `${updated.avatarUrl}?v=${updated.updatedAt.getTime()}`
            : null,

          facebookUrl: updated.facebookUrl,
          instagramUrl: updated.instagramUrl,
          githubUrl: updated.githubUrl,
          threadsUrl: updated.threadsUrl,
          linkedinUrl: updated.linkedinUrl,
          twitterUrl: updated.twitterUrl,
          youtubeUrl: updated.youtubeUrl,

          whatsappNumber: updated.whatsappNumber,
          phoneNumber: updated.phoneNumber,

          contactEmail: updated.contactEmail,

          profileVisibility: updated.profileVisibility,
        },
      },
    });
  });
}
