import { User } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";

const createUser = async (
  payload: Omit<User, "id" | "updatedAt" | "createdAt">,
) => {
  const hashedPassword = await bcrypt.hash(payload?.password, 8);

  const result = await prisma.user.create({
    data: { ...payload, password: hashedPassword },
  });

  const { password, ...newResult } = result;

  return newResult;
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

  
  return user;
};

export const authService = {
  createUser,
  loginUser,
};
