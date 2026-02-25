import Fastify from "fastify";
import { errorHandler } from "./core/errorHandler.js";
import security from "./plugins/security.js";
import jwtPlugin from "./plugins/jwt.js";
import rateLimit from "./plugins/rateLimit.js";
import ipBlock from "./plugins/ipBlock.js";
import multipart from "@fastify/multipart";

import authRoutes from "./modules/auth/auth.routes.js";
import profileRoutes from "./modules/profile/profile.routes.js";
import publicRoutes from "./modules/public/public.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";
import adsRoutes from "./modules/ads/ads.routes.js";
import searchRoutes from "./modules/search/search.routes.js";
import reportsRoutes from "./modules/reports/reports.routes.js";
import uploadRoutes from "./modules/uploads/uploads.routes.js";

export const buildApp = () => {
  const app = Fastify({ logger: true });

  app.setErrorHandler(errorHandler);

  app.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  });

  app.register(security);
  app.register(jwtPlugin);
  app.register(rateLimit);
  app.register(ipBlock);

  app.register(authRoutes);
  app.register(profileRoutes);
  app.register(publicRoutes);
  app.register(adminRoutes);
  app.register(adsRoutes);
  app.register(searchRoutes);
  app.register(reportsRoutes);
  app.register(uploadRoutes);

  return app;
};
