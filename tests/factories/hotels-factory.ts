import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createHotel() {
  const hotel = await prisma.hotel.create({
    data: {
      name: faker.company.companyName(),
      image: faker.image.imageUrl(),
    },
  });

  return hotel;
}

export async function createRoom(hotelId: number) {
  const room = await prisma.room.create({
    data: {
      name: faker.random.word(),
      capacity: faker.datatype.number({ min: 1, max: 4 }),
      hotelId: hotelId,
    },
  });

  return room;
}
