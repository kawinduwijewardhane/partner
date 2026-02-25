import { prisma } from "../../core/prisma.js";
import { buildDOBRange } from "../../utils/ageFilter.js";
import { buildPagination } from "../../utils/pagination.js";
import { calculateAge } from "../../utils/age.js";

export default async function (app) {
  app.get("/search", async (req, reply) => {
    const {
      gender,
      min_age,
      max_age,
      marital_status,
      relationship_type,
      job,
      verified,
      keyword,
      sort,
      cursor,
      limit,
    } = req.query;

    const { from, to } = buildDOBRange(min_age, max_age);

    const whereClause = {
      status: "active",
      user: {
        isBanned: false,
      },
    };

    if (relationship_type) {
      whereClause.relationshipType = relationship_type;
    }

    if (gender && gender !== "all") {
      whereClause.user = {
        ...whereClause.user,
        gender,
      };
    }

    if (marital_status) {
      whereClause.user = {
        ...whereClause.user,
        maritalStatus: marital_status,
      };
    }

    if (verified === "true") {
      whereClause.user = {
        ...whereClause.user,
        isVerified: true,
      };
    }

    if (job) {
      whereClause.user = {
        ...whereClause.user,
        currentJob: {
          contains: job,
          mode: "insensitive",
        },
      };
    }

    if (from || to) {
      whereClause.user = {
        ...whereClause.user,
        dateOfBirth: {
          gte: from ?? undefined,
          lte: to ?? undefined,
        },
      };
    }

    if (keyword) {
      whereClause.OR = [
        { title: { contains: keyword } },
        { description: { contains: keyword } },
        {
          user: {
            firstName: { contains: keyword },
          },
        },
        {
          user: {
            lastName: { contains: keyword },
          },
        },
        {
          user: {
            currentJob: { contains: keyword },
          },
        },
        {
          user: {
            username: { contains: keyword },
          },
        },
      ];
    }

    let orderBy = { createdAt: "desc" };

    if (sort === "oldest") orderBy = { createdAt: "asc" };
    if (sort === "age_asc") orderBy = { user: { dateOfBirth: "desc" } };
    if (sort === "age_desc") orderBy = { user: { dateOfBirth: "asc" } };
    if (sort === "recently_updated") orderBy = { updatedAt: "desc" };

    const pagination = buildPagination(cursor, Number(limit) || 10);

    const ads = await prisma.ad.findMany({
      where: whereClause,
      include: {
        user: true,
      },
      orderBy,
      ...pagination,
    });

    let nextCursor = null;

    if (ads.length > (Number(limit) || 10)) {
      const nextItem = ads.pop();
      nextCursor = nextItem.id;
    }

    const sanitized = ads.map((ad) => ({
      username: ad.user.username,

      fullName: ad.user.displayFullName
        ? `${ad.user.firstName} ${ad.user.lastName}`
        : null,

      verified: ad.user.isVerified,

      gender: ad.user.gender,
      age: calculateAge(ad.user.dateOfBirth),
      maritalStatus: ad.user.maritalStatus,
      currentJob: ad.user.currentJob || null,

      relationshipType: ad.relationshipType,
      title: ad.title,
      description: ad.description,

      avatarUrl: ad.user.avatarUrl || null,
    }));

    return reply.send({
      items: sanitized,
      nextCursor,
    });
  });
}
