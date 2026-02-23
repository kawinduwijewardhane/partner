import fp from "fastify-plugin"
import helmet from "@fastify/helmet"
import cors from "@fastify/cors"
import cookie from "@fastify/cookie"
import { env } from "../config/env.js"

export default fp(async (app) => {
  await app.register(helmet)

  await app.register(cors, {
    origin: env.CLIENT_URL,
    credentials: true
  })

  await app.register(cookie, {
    secret: env.COOKIE_SECRET,
    parseOptions: {}
  })
})