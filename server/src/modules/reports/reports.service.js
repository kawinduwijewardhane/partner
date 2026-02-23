import { prisma } from "../../core/prisma.js"

export const createReportService = async (reporterId, data) => {

  if (!data.reason) {
    throw new Error("Reason required")
  }

  if (!data.reportedUserId && !data.adId) {
    throw new Error("Invalid target")
  }

  if (data.reportedUserId === reporterId) {
    throw new Error("Cannot report yourself")
  }

  if (data.adId) {
    const ad = await prisma.ad.findUnique({
      where: { id: data.adId }
    })

    if (!ad) throw new Error("Ad not found")
  }

  if (data.reportedUserId) {
    const user = await prisma.user.findUnique({
      where: { id: data.reportedUserId }
    })

    if (!user) throw new Error("User not found")
  }

  const report = await prisma.report.create({
    data: {
      reason: data.reason,
      description: data.description,
      reporterId,
      reportedUserId: data.reportedUserId ?? null,
      adId: data.adId ?? null
    }
  })

  return report
}