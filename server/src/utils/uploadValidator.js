export const validateImage = (file, maxSizeMB) => {

  const allowed = ["image/jpeg", "image/png", "image/webp"]

  if (!allowed.includes(file.mimetype)) {
    throw new Error("Invalid file type")
  }

  const maxBytes = maxSizeMB * 1024 * 1024

  if (file.file.truncated) {
    throw new Error("File too large")
  }

}