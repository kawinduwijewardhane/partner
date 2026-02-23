import QRCode from "qrcode"
import fs from "fs"
import path from "path"
import os from "os"
import { env } from "../config/env.js"
import { uploadViaSSH } from "./sshUpload.js"

export const generateProfileQR = async (userId, username) => {

  const url = `${env.CLIENT_URL}/user/${username}`
  const fileName = `${userId}.webp`
  const relativePath = `qrcodes/${fileName}`

  if (env.NODE_ENV === "development") {

    const tempDir = path.join(os.tmpdir(), "qr-temp")
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }

    const localPath = path.join(tempDir, fileName)

    await QRCode.toFile(localPath, url, {
      type: "image/webp"
    })

    const remoteDir = `${env.CDN_UPLOAD_PATH}/qrcodes`
    const remoteFile = `${remoteDir}/${fileName}`

    await uploadViaSSH(localPath, remoteDir, remoteFile, env)

    fs.unlinkSync(localPath)
  }

  if (env.NODE_ENV === "production") {

    const dir = path.join(env.CDN_UPLOAD_PATH, "qrcodes")
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    const filePath = path.join(dir, fileName)

    await QRCode.toFile(filePath, url, {
      type: "image/webp"
    })
  }

  return `${env.CDN_BASE_URL}/${relativePath}`
}