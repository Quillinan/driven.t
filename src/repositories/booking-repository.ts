import { prisma } from '@/config';

async function findWithRoomByUserId(userId: number) {
  return await prisma.booking.findFirst({
    where: { userId },
    include: {
      Room: true,
    },
  });
}

async function create(userId: number, roomId: number) {
  const newBooking = await prisma.booking.create({
    data: {
      userId,
      roomId,
    },
    include: {
      Room: true,
    },
  });

  return newBooking;
}

async function findRoomByRoomId(roomId: number) {
  return await prisma.room.findFirst({
    where: { id: roomId },
    include: {
      Booking: true,
    },
  });
}

export const bookingRepository = {
  findWithRoomByUserId,
  create,
  findRoomByRoomId,
};
