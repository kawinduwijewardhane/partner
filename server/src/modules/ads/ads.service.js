import { prisma } from "../../core/prisma.js";
import { AppError } from "../../core/AppError.js";

const ALLOWED_REL_TYPES = ["long_term", "short_term"];
const ALLOWED_STATUSES = ["active", "paused", "deleted"];

export const getMyAdService = async (userId) => {
  const ad = await prisma.ad.findUnique({
    where: { userId },
  });

  return ad;
};

export const createAdService = async (user, body) => {
  if (!user.isEmailVerified) {
    throw new AppError("Email verification required", 403);
  }

  if (
    !user.firstName ||
    !user.lastName ||
    !user.username ||
    !user.gender ||
    !user.maritalStatus ||
    !user.dateOfBirth
  ) {
    throw new AppError("Complete your profile before creating an ad", 400);
  }

  const existing = await prisma.ad.findUnique({
    where: { userId: user.id },
  });

  if (existing) {
    throw new AppError("You already have an advertisement", 400);
  }

  if (
    !body.relationshipType ||
    !ALLOWED_REL_TYPES.includes(body.relationshipType)
  ) {
    throw new AppError("Invalid relationship type", 400);
  }

  if (!body.title || body.title.length < 5) {
    throw new AppError("Title must be at least 5 characters", 400);
  }

  const MIN_DESC = 100;
  const MAX_DESC = 20000;

  if (!body.description || body.description.trim().length < MIN_DESC) {
    throw new AppError(
      `Description must be at least ${MIN_DESC} characters`,
      400,
    );
  }

  if (body.description.trim().length > MAX_DESC) {
    throw new AppError(`Description cannot exceed ${MAX_DESC} characters`, 400);
  }

  const ad = await prisma.ad.create({
    data: {
      relationshipType: body.relationshipType,
      title: body.title.trim(),
      description: body.description.trim(),
      status: "active",
      userId: user.id,
    },
  });

  return ad;
};

export const updateAdService = async (userId, data) => {
  const ad = await prisma.ad.findUnique({
    where: { userId },
  });

  if (!ad) {
    throw new AppError("Advertisement not found", 404);
  }

  const updateData = {};

  if (data.relationshipType) {
    if (!ALLOWED_REL_TYPES.includes(data.relationshipType)) {
      throw new AppError("Invalid relationship type", 400);
    }
    updateData.relationshipType = data.relationshipType;
  }

  if (data.title !== undefined) {
    if (data.title.length < 5) {
      throw new AppError("Title must be at least 5 characters", 400);
    }
    updateData.title = data.title.trim();
  }

  if (data.description !== undefined) {
    if (data.description.length < 20) {
      throw new AppError("Description must be at least 20 characters", 400);
    }
    updateData.description = data.description.trim();
  }

  const updated = await prisma.ad.update({
    where: { id: ad.id },
    data: updateData,
  });

  return updated;
};

export const changeAdStatusService = async (user, status) => {
  const ad = await prisma.ad.findUnique({
    where: { userId: user.id },
  });

  if (!ad) {
    throw new AppError("Advertisement not found", 404);
  }

  if (!ALLOWED_STATUSES.includes(status)) {
    throw new AppError("Invalid status", 400);
  }

  if (status === "active") {
    if (!user.isEmailVerified) {
      throw new AppError("Email verification required", 403);
    }

    if (
      !user.firstName ||
      !user.lastName ||
      !user.username ||
      !user.gender ||
      !user.maritalStatus ||
      !user.dateOfBirth
    ) {
      throw new AppError("Complete your profile before activating ad", 400);
    }
  }

  const updated = await prisma.ad.update({
    where: { id: ad.id },
    data: { status },
  });

  return updated;
};
