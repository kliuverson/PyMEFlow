
import { prisma } from "../../config/database";

export async function getUserCompanies(userId: string) {
  const memberships = await prisma.membership.findMany({
    where: {
      userId,
    },
    select: {
      role: true,
      createdAt: true,
      company: {
        select: {
          id: true,
          name: true,
          taxId: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return memberships.map((membership) => ({
    ...membership.company,
    role: membership.role,
    joinedAt: membership.createdAt,
  }));
}
