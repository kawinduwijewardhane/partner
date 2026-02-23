import { requireAuth } from "../../middlewares/requireAuth.js"
import {
  createAdService,
  updateAdService,
  changeAdStatusService
} from "./ads.service.js"

export default async function (app) {

  app.post("/ads", { preHandler: requireAuth }, async (req, reply) => {

    const ad = await createAdService(req.user, req.body)

    return reply.send({
      success: true,
      data: ad
    })
  })

  app.patch("/ads", { preHandler: requireAuth }, async (req, reply) => {

    const updated = await updateAdService(req.user.id, req.body)

    return reply.send({
      success: true,
      data: updated
    })
  })

  app.patch("/ads/status", { preHandler: requireAuth }, async (req, reply) => {

    const updated = await changeAdStatusService(req.user, req.body.status)

    return reply.send({
      success: true,
      data: updated
    })
  })

}