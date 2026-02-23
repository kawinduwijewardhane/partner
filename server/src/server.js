import { buildApp } from "./app.js"
import { env } from "./config/env.js"
import dotenv from "dotenv";

dotenv.config();

const app = buildApp()

app.listen({
  port: env.PORT,
  host: "0.0.0.0"
})