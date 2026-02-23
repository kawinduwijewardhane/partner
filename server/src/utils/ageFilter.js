export const buildDOBRange = (minAge, maxAge) => {
  const today = new Date()

  let from = null
  let to = null

  if (minAge) {
    to = new Date(
      today.getFullYear() - Number(minAge),
      today.getMonth(),
      today.getDate()
    )
  }

  if (maxAge) {
    from = new Date(
      today.getFullYear() - Number(maxAge) - 1,
      today.getMonth(),
      today.getDate()
    )
  }

  return { from, to }
}