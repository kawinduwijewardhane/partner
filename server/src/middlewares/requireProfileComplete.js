export const requireProfileComplete = async (req, reply) => {
  const u = req.user

  if (
    !u.firstName ||
    !u.lastName ||
    !u.username ||
    !u.gender ||
    !u.maritalStatus ||
    !u.dateOfBirth
  ) {
    return reply.code(400).send({ message: "Profile incomplete" })
  }
}