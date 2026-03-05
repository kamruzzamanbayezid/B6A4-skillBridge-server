import { prisma } from "../../lib/prisma";

const createCategory = async (payload: { name: string }) => {
  const isCategoryExists = await prisma.category.findUnique({
    where: {
      name: payload?.name,
    },
  });

  if (isCategoryExists) {
    throw new Error("This category is already exists!");
  }

  const result = await prisma.category.create({
    data: payload,
  });

  return result;
};

const getALlCategories = async () => {
  const result = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          tutors: true,
        },
      },
    },
  });
  return result;
};

const updateCategory = async (id: string, name: string) => {
  const isCategoryExists = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!isCategoryExists) {
    throw new Error("This category does not exist!");
  }
  console.log({ id, name });
  const result = await prisma.category.update({
    where: {
      id,
    },
    data: { name },
  });
  return result;
};

const deleteCategory = async (id: string) => {
  const tutorsCount = await prisma.tutorProfile.count({
    where: {
      categoryId: id,
    },
  });

  if (tutorsCount > 0) {
    throw new Error(
      "Cannot delete category. There are tutors assigned to this category",
    );
  }

  const result = await prisma.category.delete({
    where: { id },
  });

  return result;
};

export const categoryService = {
  createCategory,
  getALlCategories,
  updateCategory,
  deleteCategory,
};
