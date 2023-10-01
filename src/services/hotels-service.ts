import { Hotel } from '@prisma/client';
import { invalidDataError, notFoundError } from '@/errors';
import { hotelsRepository } from '@/repositories';

async function findHotels(): Promise<Hotel[]> {
  const hotels = await hotelsRepository.findHotels();
  if (!hotels || hotels.length === 0) throw notFoundError();
  return hotels;
}

async function getHotelByHotelId(hotelId: string) {
  const hotelIdNumber = parseInt(hotelId);

  if (isNaN(hotelIdNumber)) {
    throw invalidDataError('HotelId');
  }

  const hotel = await hotelsRepository.findHotelById(hotelIdNumber, { include: { Rooms: true } });
  if (!hotel) throw notFoundError();

  return hotel;
}

export const hotelsService = {
  findHotels,
  getHotelByHotelId,
};
