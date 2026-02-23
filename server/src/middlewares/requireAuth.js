import { prisma } from "../core/prisma.js"
import { AppError } from "../core/AppError.js"

export const requireAuth = async (req, reply) => {
  try {
    const decoded = await req.jwtVerify()

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user) throw new AppError("Unauthorized", 401)
    if (user.isBanned) throw new AppError("Account suspended", 403)
    if (decoded.tokenVersion !== user.tokenVersion)
      throw new AppError("Unauthorized", 401)

    req.user = user

  } catch (err) {
    throw new AppError("Unauthorized", 401)
  }
}