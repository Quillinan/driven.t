import { Enrollment, Hotel, Ticket, TicketStatus } from '@prisma/client';
import { prisma } from '@/config';

async function findHotels(): Promise<Hotel[]> {
  const hotels = await prisma.hotel.findMany();
  return hotels;
}

async function findHotelById(hotelId: number, options?: any) {
  const result = await prisma.hotel.findUnique({
    where: { id: hotelId },
    ...options,
  });

  return result;
}

async function findUserEnrollment(userId: number): Promise<Enrollment> {
  const enrollment = await prisma.enrollment.findFirst({
    where: { userId },
  });

  return enrollment;
}

export const hotelsRepository = {
  findHotels,
  findHotelById,
  findUserEnrollment,
};
