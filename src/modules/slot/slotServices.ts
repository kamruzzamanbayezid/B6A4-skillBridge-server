import { prisma } from "../../lib/prisma";

type ISlotPayload = {
  tutorProfileId: string;
  day: string;
  startTime: string;
  endTime: string;
};

const createSlot = async (payload: ISlotPayload) => {
  const { tutorProfileId, day, startTime, endTime } = payload;

  const start = new Date(startTime);
  const end = new Date(endTime);
  const now = new Date();
  const duration = (end.getTime() - start.getTime()) / (1000 * 60);

  if (duration <= 0) {
    throw new Error("Start time must be before end time!");
  }

  if (duration < 30) {
    throw new Error("Slot must be at least 30 minutes long");
  }

  if (duration > 180) {
    throw new Error("Slot cannot exceed 3 hours");
  }

  if (start >= end) {
    throw new Error("Start time must be before end time!");
  }

  if (start < now) {
    throw new Error("You cannot create a slot for a past date or time!");
  }

  const isSlotExist = await prisma.slot.findFirst({
    where: {
      tutorProfileId,
      AND: [{ startTime: { lt: end } }, { endTime: { gt: start } }],
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
