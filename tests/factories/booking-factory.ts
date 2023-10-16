import { TicketStatus } from '@prisma/client';
import { createEnrollmentWithAddress, createPayment, createTicket, createTicketType, createUser } from '../factories';
import { createHotel, createRoomWithHotelId } from '../factories/hotels-factory';
import { generateValidToken } from '../helpers';
import { prisma } from '@/config';

export async function createBookingWithRoom(userId: number, roomId: number) {
  return await prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}

export async function createTicketAndPayment(
  isRemote = false,
  includesHotel = true,
  paid = true,
  includesRoom = true,
  capacity?: number,
) {
  let payment;
  if (paid) {
    payment = TicketStatus.PAID;
  } else {
    payment = TicketStatus.RESERVED;
  }
  const user = await createUser();
  const token = await generateValidToken(user);
  const enrollment = await createEnrollmentWithAddress(user);
  const ticketType = await createTicketType(isRemote, includesHotel);
  const ticket = await createTicket(enrollment.id, ticketType.id, payment);
  await createPayment(ticket.id, ticketType.price);
  let room = null;
  if (includesRoom) {
    const hotel = await createHotel();
    room = await createRoomWithHotelId(hotel.id, capacity);
  }

  return { token, room, user };
}
