import { prisma } from "../../core/prisma.js"
import { requireAuth } from "../../middlewares/requireAuth.js"
import { requireAdmin } from "../../middlewares/requireAdmin.js"

export default async function (app) {

  app.patch("/admin/suspend-user/:userId",
    { preHandler: [requireAuth, requireAdmin] },
    async (req, reply) => {

      const { userId } = req.params

      await prisma.user.update({
        where: { id: userId },
        data: {
          isBanned: true,
          tokenVersion: { increment: 1 }
        }
      })

      await prisma.auditLog.create({
        data: {
          action: "SUSPEND_USER",
          adminId: req.user.id,
          targetId: userId
        }
      })

      return reply.send({ success: true })
    }
  )

  app.patch("/admin/suspend-ad/:adId",
    { preHandler: [requireAuth, requireAdmin] },
    async (req, reply) => {

      const { adId } = req.params

      await prisma.ad.update({
        where: { id: adId },
        data: { status: "suspended_by_admin" }
      })

      await prisma.auditLog.create({
        data: {
          action: "SUSPEND_AD",
          adminId: req.user.id,
          targetId: adId
        }
      })

      return reply.send({ success: true })
    }
  )

}