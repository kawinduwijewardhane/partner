export const buildPagination = (cursor, limit = 10) => {
  return {
    take: limit + 1,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined
  }
}