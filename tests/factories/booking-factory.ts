import { prisma } from '@/config';

export async function createBookingWithRoom(userId: number, roomId: number) {
  return await prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}
