import bcrypt from "bcryptjs";
import { User } from "../../../generated/prisma/client";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import jwt from "jsonwebtoken";

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

  const userData = {
    id: user?.id,
    name: user?.name,
    email: user?.email,
    role: user?.role,
  };

  if (!config?.jwt_secret) {
    throw new Error("JWT Secret is not defined in configuration!");
  }

  const token = await jwt.sign(userData, config.jwt_secret, {
    expiresIn: "7d",
  });

  return { token, user };
};

export const authService = {
  createUser,
  loginUser,
};
