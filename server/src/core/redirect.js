export const validateRedirect = (value) => {
  if (!value) return "/"

  if (!value.startsWith("/")) return "/"
  if (value.includes("http")) return "/"
  if (value.includes("//")) return "/"

  return value
}