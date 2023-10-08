import { prisma } from '@/config';

async function findWithRoomByUserId(userId: number) {
  return await prisma.booking.findFirst({
    where: { userId },
    include: {
      Room: true,
    },
  });
}

export const bookingRepository = {
  findWithRoomByUserId,
};
