import bcrypt from "bcryptjs";
import { User, UserRole } from "../../../generated/prisma/client";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import jwt from "jsonwebtoken";

const createUser = async (payload: any) => {
  const { password, tutorProfile, ...userData } = payload;

  const hashedPassword = await bcrypt.hash(password, 8);

  return await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: { ...userData, password: hashedPassword },
    });

    if (payload?.role === UserRole.TUTOR) {
      if (!tutorProfile || !tutorProfile.categoryId) {
        throw new Error(
          "If you register as a tutor you must provide category name and subject",
        );
      }

      await tx.tutorProfile.create({
        data: {
          subjects: tutorProfile?.subjects,
          experienceYears: tutorProfile?.experienceYears,
          categoryId: tutorProfile?.categoryId,
          userId: newUser?.id,
          bio: tutorProfile?.bio || "",
          hourlyRate: tutorProfile?.hourlyRate || 0,
        },
      });
    }

    const { password, ...user } = newUser;

    return user;
  });
};

const loginUser = async (payload: { email: string; password: string }) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    throw new Error("Invalid email or password!");
  }

  const isPasswordMatch = await bcrypt.compare(payload.password, user.password);

  if (!isPasswordMatch) {
    throw new Error("Invalid email or password!");
  }

  const userData = {
    id: user?.id,
    name: user?.name,
    email: user?.email,
    image: user?.image,
    role: user?.role,
    isBanned: user?.isBanned,
  };

  if (!config?.jwt_secret) {
    throw new Error("JWT Secret is not defined in configuration!");
  }

  const token = jwt.sign(userData, config.jwt_secret, {
    expiresIn: "7d",
  });

  return { token, user };
};

const getCurrentUser = async (id: string) => {
  const result = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      tutorProfile: true,
    },
  });

  if (!result) {
    throw new Error("User not found");
  }

  const { password, ...newResult } = result;
  return newResult;
};

export const authService = {
  createUser,
  loginUser,
  getCurrentUser,
};
