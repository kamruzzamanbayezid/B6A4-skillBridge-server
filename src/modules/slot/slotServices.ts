import { prisma } from "../../lib/prisma";

type ISlotPayload = {
  tutorProfileId: string;
  day: string;
  startTime: string;
  endTime: string;
};

const createSlot = async (payload: ISlotPayload) => {
  const { tutorProfileId, day, startTime, endTime } = payload;

  const isSlotExist = await prisma.slot.findFirst({
    where: {
      tutorProfileId,
      day,
      AND: [
        { startTime: { lt: new Date(endTime) } },

        { endTime: { gt: new Date(startTime) } },
      ],
    },
  });

  if (isSlotExist) {
    throw new Error("A slot already exists in this time range!");
  }

  const result = await prisma.slot.create({
    data: payload,
  });

  return result;
};

const tutorsSlot = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      tutorProfile: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("User is not found");
  }

  const result = await prisma.slot.findMany({
    where: {
      tutorProfileId: user?.tutorProfile?.id,
    },
  });
  return result;
};

const deleteSlot = async (id: string) => {
  const isSlotExist = await prisma.slot.findUnique({
    where: {
      id,
    },
  });

  if (!isSlotExist) {
    throw new Error("This slot is not exist!");
  }

  const result = await prisma.slot.delete({
    where: {
      id,
    },
  });

  return result;
};

export const slotServices = { createSlot, tutorsSlot, deleteSlot };
