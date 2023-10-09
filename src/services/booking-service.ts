import { TicketStatus } from '@prisma/client';
import { notFoundError } from '@/errors';
import { bookingRepository, enrollmentRepository, ticketsRepository } from '@/repositories';
import { noPermissionToBooking } from '@/errors/booking-error';

async function getWithRoomByUserId(userId: number) {
  const booking = await bookingRepository.findWithRoomByUserId(userId);
  if (!booking) {
    throw notFoundError();
  }

  return {
    id: booking.id,
    Room: booking.Room,
  };
}

async function createBooking(userId: number, roomId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  const type = ticket.TicketType;

  if (ticket.status === TicketStatus.RESERVED || type.isRemote || !type.includesHotel) {
    throw noPermissionToBooking();
  }

  const room = await bookingRepository.findRoomByRoomId(roomId);

  if (!room) throw notFoundError();

  if (room.capacity <= room.Booking.length) throw noPermissionToBooking();

  const newBooking = await bookingRepository.create(userId, roomId);
  return {
    bookingId: newBooking.id,
  };
}

export const bookingService = {
  getWithRoomByUserId,
  createBooking,
};
