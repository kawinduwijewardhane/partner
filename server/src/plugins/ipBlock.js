import fp from "fastify-plugin"
import { prisma } from "../core/prisma.js"

export default fp(async (app) => {
  app.addHook("onRequest", async (req, reply) => {
    const ip = req.ip
    const blocked = await prisma.blockedIP.findUnique({
      where: { ip }
    })

    if (blocked) {
      return reply.code(403).send({ message: "Access denied" })
    }
  })
})