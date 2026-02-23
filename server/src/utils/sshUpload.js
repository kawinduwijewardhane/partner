import { exec } from "child_process"
import path from "path"

export const uploadViaSSH = (localFile, remoteDir, remoteFile, env) => {
  return new Promise((resolve, reject) => {

    exec(
      `ssh ${env.CDN_SSH_USER}@${env.CDN_SSH_HOST} "mkdir -p ${remoteDir}" && scp ${localFile} ${env.CDN_SSH_USER}@${env.CDN_SSH_HOST}:${remoteFile}`,
      (err) => {
        if (err) return reject(err)
        resolve()
      }
    )

  })
}