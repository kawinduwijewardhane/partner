export const sanitizeUser = (user) => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  username: user.username,
  // email: user.email,
  gender: user.gender,
  role: user.role,
  isEmailVerified: user.isEmailVerified,
  verified: user.isVerified,
  verifiedAt: user.verifiedAt || null,
  displayFullName: user.displayFullName,
  maritalStatus: user.maritalStatus,
  dateOfBirth: user.dateOfBirth,
  currentJob: user.currentJob,
  bio: user.bio,
  avatarUrl: user.avatarUrl,

  facebookUrl: user.facebookUrl,
  instagramUrl: user.instagramUrl,
  githubUrl: user.githubUrl,
  threadsUrl: user.threadsUrl,
  linkedinUrl: user.linkedinUrl,
  twitterUrl: user.twitterUrl,
  youtubeUrl: user.youtubeUrl,

  whatsappNumber: user.whatsappNumber,
  phoneNumber: user.phoneNumber,
  otherContactMethod: user.otherContactMethod,
  contactEmail: user.contactEmail,

  profileVisibility: user.profileVisibility,

  profileViewsCount: user.profileViewsCount,

  createdAt: user.createdAt,
});
