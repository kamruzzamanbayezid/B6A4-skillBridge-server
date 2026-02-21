import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { UserRole } from "../../generated/prisma/enums";

const seedAdmin = async () => {
  try {
    const hashedPassword = await bcrypt.hash("123456", 12);

    const adminInfo: {
      name: string;
      email: string;
      password: string;
      role: UserRole;
    } = {
      name: "Admin",
      email: "admin1@gmail.com",
      password: hashedPassword,
      role: "ADMIN",
    };

    const isUserExists = await prisma.user.findUnique({
      where: {
        email: adminInfo.email,
      },
    });

    if (isUserExists) {
      console.log("Admin already exists, skipping seed.");
      return;
    }

    const result = await prisma.user.create({
      data: adminInfo,
    });

    console.log("Admin seeded successfully!", result);
  } catch (error) {
    console.error("Error seeding admin:", error);
  } finally {
    await prisma.$disconnect();
  }
};

seedAdmin();
