import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createHotel() {
  const fakeHotelData = {
    name: faker.company.companyName(),
    image: faker.image.imageUrl(),
  };

  const hotel = await prisma.hotel.create({
    data: fakeHotelData,
  });

  return hotel;
}
