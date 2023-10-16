import { bookingRepository } from '@/repositories';
import { bookingService } from '@/services';

beforeEach(async () => {
  jest.clearAllMocks();
});

describe('GET /booking', () => {
  it('should throw notFoundError if there is no booking', async () => {
    const userId = 1;

    jest.spyOn(bookingRepository, 'findWithRoomByUserId').mockImplementationOnce(() => {
      return undefined;
    });

    const promise = bookingService.getWithRoomByUserId(userId);

    await expect(promise).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });

  it('should return booking data when a booking is found', async () => {
    const fakeRoom = {
      id: 1,
      name: 'Fake Room Name',
      capacity: 10,
      hotelId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const fakeBooking = {
      id: 1,
      User: {
        id: 1,
      },
      userId: 1,
      Room: fakeRoom,
      roomId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(bookingRepository, 'findWithRoomByUserId').mockResolvedValue(fakeBooking);

    const result = await bookingService.getWithRoomByUserId(fakeBooking.userId);

    expect(result.id).toBe(fakeRoom.id);
    expect(result.Room).toEqual(fakeRoom);
  });
});

// describe('POST /booking', () => {
//   it('should throw notFoundError if there is no booking', async () => {});
// });

// describe('PUT /booking', () => {
//   it('should throw notFoundError if there is no booking', async () => {});
// });
