import { prisma } from "../../core/prisma.js"
import { generateProfileQR } from "../../utils/qr.js"
import { AppError } from "../../core/AppError.js"

export const updateProfileService = async (userId, data) => {

  const existing = await prisma.user.findUnique({
    where: { id: userId }
  })

  if (!existing) {
    throw new AppError("User not found", 404)
  }

  let qrPath = null

  if (data.username && data.username !== existing.username) {
    qrPath = await generateProfileQR(userId, data.username)
  }

  const updateData = {
    ...(data.firstName !== undefined && { firstName: data.firstName }),
    ...(data.lastName !== undefined && { lastName: data.lastName }),
    ...(data.username !== undefined && { username: data.username }),
    ...(data.maritalStatus !== undefined && { maritalStatus: data.maritalStatus }),
    ...(data.currentJob !== undefined && { currentJob: data.currentJob }),
    ...(data.bio !== undefined && { bio: data.bio }),
    ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
    ...(data.facebookUrl !== undefined && { facebookUrl: data.facebookUrl }),
    ...(data.instagramUrl !== undefined && { instagramUrl: data.instagramUrl }),
    ...(data.otherContactMethod !== undefined && { otherContactMethod: data.otherContactMethod }),
    ...(data.contactEmail !== undefined && { contactEmail: data.contactEmail }),
    ...(data.contactEmailVisible !== undefined && { contactEmailVisible: data.contactEmailVisible }),
    ...(data.displayFullName !== undefined && { displayFullName: data.displayFullName }),
  }

  if (data.dateOfBirth) {
    const parsed = new Date(data.dateOfBirth)

    if (isNaN(parsed.getTime())) {
      throw new AppError("Invalid date of birth format", 400)
    }

    if (parsed > new Date()) {
      throw new AppError("Date of birth cannot be in the future", 400)
    }

    updateData.dateOfBirth = parsed
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: updateData
  })

  return { updated, qrPath }
}