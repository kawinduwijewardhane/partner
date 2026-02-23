import fs from "fs";
import os from "os";
import path from "path";
import sharp from "sharp";
import { requireAuth } from "../../middlewares/requireAuth.js";
import { prisma } from "../../core/prisma.js";
import { env } from "../../config/env.js";
import { validateImage } from "../../utils/uploadValidator.js";
import { uploadViaSSH } from "../../utils/sshUpload.js";

export default async function (app) {
  app.post(
    "/upload/avatar",
    { preHandler: requireAuth },
    async (req, reply) => {
      const file = await req.file();
      if (!file) return reply.code(400).send({ message: "File required" });

      validateImage(file, Number(process.env.MAX_AVATAR_SIZE_MB));

      const buffer = await file.toBuffer();
      const userId = req.user.id;

      const fileName = "avatar.webp";
      const relativeDir = `avatars/users/${userId}`;
      const relativePath = `${relativeDir}/${fileName}`;

      if (env.NODE_ENV === "development") {
        const tempDir = path.join(os.tmpdir(), "avatar-temp");
        await fs.promises.mkdir(tempDir, { recursive: true });

        const localPath = path.join(tempDir, `${userId}.webp`);

        await sharp(buffer)
          .resize(256, 256, { fit: "cover" })
          .webp({ quality: 85 })
          .toFile(localPath);

        const remoteDir = `${env.CDN_UPLOAD_PATH}/${relativeDir}`;
        const remoteFile = `${remoteDir}/${fileName}`;

        await uploadViaSSH(localPath, remoteDir, remoteFile, env);

        await fs.promises.unlink(localPath);
      } else {
        const localDir = path.join(env.CDN_UPLOAD_PATH, relativeDir);
        await fs.promises.mkdir(localDir, { recursive: true });

        const localPath = path.join(localDir, fileName);

        await sharp(buffer)
          .resize(256, 256, { fit: "cover" })
          .webp({ quality: 85 })
          .toFile(localPath);
      }

      await prisma.user.update({
        where: { id: userId },
        data: { avatarUrl: relativePath },
      });

      return reply.send({
        success: true,
        avatarUrl: `${env.CDN_BASE_URL}/${relativePath}`,
      });
    },
  );

  app.post(
    "/upload/ad-media",
    { preHandler: requireAuth },
    async (req, reply) => {
      const ad = await prisma.ad.findUnique({
        where: { userId: req.user.id },
      });

      if (!ad) return reply.code(400).send({ message: "Ad not found" });

      const file = await req.file();
      if (!file) return reply.code(400).send({ message: "File required" });

      validateImage(file, Number(process.env.MAX_MEDIA_SIZE_MB));

      const buffer = await file.toBuffer();

      const fileName = "media.webp";
      const relativeDir = `ads/${ad.id}`;
      const relativePath = `${relativeDir}/${fileName}`;

      if (env.NODE_ENV === "development") {
        const tempDir = path.join(os.tmpdir(), "ad-temp");
        await fs.promises.mkdir(tempDir, { recursive: true });

        const localPath = path.join(tempDir, `${ad.id}.webp`);

        await sharp(buffer)
          .resize(1024, 1024, { fit: "inside" })
          .webp({ quality: 85 })
          .toFile(localPath);

        const remoteDir = `${env.CDN_UPLOAD_PATH}/${relativeDir}`;
        const remoteFile = `${remoteDir}/${fileName}`;

        await uploadViaSSH(localPath, remoteDir, remoteFile, env);

        await fs.promises.unlink(localPath);
      } else {
        const localDir = path.join(env.CDN_UPLOAD_PATH, relativeDir);
        await fs.promises.mkdir(localDir, { recursive: true });

        const localPath = path.join(localDir, fileName);

        await sharp(buffer)
          .resize(1024, 1024, { fit: "inside" })
          .webp({ quality: 85 })
          .toFile(localPath);
      }

      await prisma.ad.update({
        where: { id: ad.id },
        data: { mediaPath: relativePath },
      });

      return reply.send({
        success: true,
        mediaUrl: `${env.CDN_BASE_URL}/${relativePath}`,
      });
    },
  );
}
