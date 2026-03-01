import { UserRole } from "../../../generated/prisma/enums";
import { UserWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const getAllUsers = async () => {
  const result = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      isBanned: true,
    },
  });

  return result;
};

const getAllTutors = async (query: any) => {
  const { search, categoryId, rating, price } = query;

  let andConditions: UserWhereInput[] = [];

  if (search) {
    andConditions.push({
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        {
          tutorProfile: { subjects: { contains: search, mode: "insensitive" } },
        },
      ],
    });
  }

  if (categoryId) {
    andConditions.push({
      tutorProfile: { categoryId },
    });
  }

  if (rating) {
    andConditions.push({
      tutorProfile: { averageRating: { gte: Number(rating) } },
    });
  }

  if (price) {
    andConditions.push({
      tutorProfile: { hourlyRate: { lte: Number(price) } },
    });
  }

  const result = await prisma.user.findMany({
    where: {
      role: "TUTOR",
      AND: andConditions,
    },
    include: {
      tutorProfile: {
        include: { category: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return result;
};

const getAllUsersOrRole = async (role: UserRole) => {
  const result = await prisma.user.findMany({
    where: {
      role: role,
    },
    include: {
      tutorProfile: true,
    },
    orderBy: {
      tutorProfile: {
        averageRating: "desc",
      },
    },
  });
  return result;
};

const getStudentCount = async () => {
  const count = await prisma.user.count({
    where: {
      role: "STUDENT",
    },
  });
  return count;
};

const updateUserStatus = async (id: string, isBanned: boolean) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw new Error("This user isn't exists!");
  }

  const result = await prisma.user.update({
    where: { id },
    data: {
      isBanned,
    },
  });

  const { password, createdAt, updatedAt, role, image, ...newResult } = result;

  return newResult;
};

export const UserServices = {
  getAllTutors,
  getStudentCount,
  getAllUsersOrRole,
  getAllUsers,
  updateUserStatus,
};
