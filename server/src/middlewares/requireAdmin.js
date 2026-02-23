export const requireAdmin = async (req, reply) => {
  if (!req.user || req.user.role !== "ADMIN") {
    return reply.code(403).send({ message: "Forbidden" })
  }
}