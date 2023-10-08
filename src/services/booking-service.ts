import { Room } from '@prisma/client';
import { notFoundError } from '@/errors';
import { bookingRepository } from '@/repositories';

async function getWithRoomByUserId(userId: number): Promise<GetWithRoomByUserIdResult> {
  const booking = await bookingRepository.findWithRoomByUserId(userId);
  if (!booking) {
    throw notFoundError();
  }

  return {
    id: booking.id,
    Room: booking.Room,
  };
}

type GetWithRoomByUserIdResult = { id: number; Room: Room };

export const bookingService = {
  getWithRoomByUserId,
};
