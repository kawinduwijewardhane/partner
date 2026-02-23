import { prisma } from "../../core/prisma.js"
import { requireAuth } from "../../middlewares/requireAuth.js"
import { requireAdmin } from "../../middlewares/requireAdmin.js"
import { createReportService } from "./reports.service.js"

export default async function (app) {

  app.post("/reports", { preHandler: requireAuth }, async (req, reply) => {
    try {
      const report = await createReportService(req.user.id, req.body)
      return reply.send(report)
    } catch (e) {
      return reply.code(400).send({ message: e.message })
    }
  })

  app.get("/admin/reports",
    { preHandler: [requireAuth, requireAdmin] },
    async (req, reply) => {

      const reports = await prisma.report.findMany({
        include: {
          reporter: true,
          reportedUser: true,
          ad: true
        },
        orderBy: { createdAt: "desc" }
      })

      return reply.send(reports)
    }
  )

  app.patch("/admin/reports/:id/review",
    { preHandler: [requireAuth, requireAdmin] },
    async (req, reply) => {

      const { id } = req.params

      const report = await prisma.report.update({
        where: { id },
        data: { status: "reviewed" }
      })

      await prisma.auditLog.create({
        data: {
          action: "REVIEW_REPORT",
          adminId: req.user.id,
          targetId: id
        }
      })

      return reply.send(report)
    }
  )

  app.patch("/admin/reports/:id/reject",
    { preHandler: [requireAuth, requireAdmin] },
    async (req, reply) => {

      const { id } = req.params

      const report = await prisma.report.update({
        where: { id },
        data: { status: "rejected" }
      })

      await prisma.auditLog.create({
        data: {
          action: "REJECT_REPORT",
          adminId: req.user.id,
          targetId: id
        }
      })

      return reply.send(report)
    }
  )

  app.patch("/admin/reports/:id/suspend-user",
    { preHandler: [requireAuth, requireAdmin] },
    async (req, reply) => {

      const report = await prisma.report.findUnique({
        where: { id: req.params.id }
      })

      if (!report?.reportedUserId) {
        return reply.code(400).send({ message: "No user target" })
      }

      await prisma.user.update({
        where: { id: report.reportedUserId },
        data: {
          isBanned: true,
          tokenVersion: { increment: 1 }
        }
      })

      await prisma.auditLog.create({
        data: {
          action: "SUSPEND_USER_FROM_REPORT",
          adminId: req.user.id,
          targetId: report.reportedUserId
        }
      })

      return reply.send({ success: true })
    }
  )

  app.patch("/admin/reports/:id/suspend-ad",
    { preHandler: [requireAuth, requireAdmin] },
    async (req, reply) => {

      const report = await prisma.report.findUnique({
        where: { id: req.params.id }
      })

      if (!report?.adId) {
        return reply.code(400).send({ message: "No ad target" })
      }

      await prisma.ad.update({
        where: { id: report.adId },
        data: { status: "suspended_by_admin" }
      })

      await prisma.auditLog.create({
        data: {
          action: "SUSPEND_AD_FROM_REPORT",
          adminId: req.user.id,
          targetId: report.adId
        }
      })

      return reply.send({ success: true })
    }
  )

}