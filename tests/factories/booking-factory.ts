import { createUser } from './users-factory';
import { createHotel, createRoomWithHotelId } from './hotels-factory';
import { prisma } from '@/config';

export async function createBookingWithRoom() {
  const user = await createUser();
  const hotel = await createHotel();
  const room = await createRoomWithHotelId(hotel.id);

  const booking = await prisma.booking.create({
    data: {
      userId: user.id,
      roomId: room.id,
    },
  });

  const result = {
    id: booking.id,
    Room: room,
  };

  return { user, hotel, result };
}
