import supertest from 'supertest';
import { TicketStatus } from '@prisma/client';
import httpStatus from 'http-status';
import { cleanDb, generateValidToken } from '../helpers';
import { createBookingWithRoom } from '../factories/booking-factory';
import { createEnrollmentWithAddress, createPayment, createTicket, createTicketType, createUser } from '../factories';
import { createHotel, createRoomWithHotelId } from '../factories/hotels-factory';

import app, { init } from '@/app';

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe('GET /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  it('should respond with status 404 if there is no booking for given token', async () => {
    const token = await generateValidToken();
    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });
  describe('when token is valid', () => {
    it('should respond with status 200 and with booking data', async () => {
      const data = await createTicketAndPayment();
      const booking = await createBookingWithRoom(data.user.id, data.room.id);

      const response = await server.get('/booking').set('Authorization', `Bearer ${data.token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        id: booking.id,
        Room: {
          id: data.room.id,
          name: data.room.name,
          capacity: data.room.capacity,
          hotelId: data.room.hotelId,
          createdAt: data.room.createdAt.toISOString(),
          updatedAt: data.room.updatedAt.toISOString(),
        },
      });
    });
  });
});

describe('POST /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.post('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  describe('when token is valid', () => {
    it('should respond with status 403 if user ticket is remote', async () => {
      const data = await createTicketAndPayment(true, true, true, true);

      const response = await server
        .post('/booking')
        .set('Authorization', `Bearer ${data.token}`)
        .send({ roomId: data.room.id });

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 when ticket doenst include hotel', async () => {
      const data = await createTicketAndPayment(false, false, true, true);

      const response = await server
        .post('/booking')
        .set('Authorization', `Bearer ${data.token}`)
        .send({ roomId: data.room.id });

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 when ticket is not paid ', async () => {
      const data = await createTicketAndPayment(false, true, false, true);

      const response = await server
        .post('/booking')
        .set('Authorization', `Bearer ${data.token}`)
        .send({ roomId: data.room.id });

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 when there is no vacancy in the room', async () => {
      const data = await createTicketAndPayment(false, true, true, true, 0);

      const response = await server
        .post('/booking')
        .set('Authorization', `Bearer ${data.token}`)
        .send({ roomId: data.room.id });

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it('should respond with status 404 if room does not exist', async () => {
      const data = await createTicketAndPayment(false, true, true, false);

      const response = await server.post('/booking').set('Authorization', `Bearer ${data.token}`).send({ roomId: 0 });

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should respond with status 200 and with booking data', async () => {
      const data = await createTicketAndPayment();
      const response = await server
        .post('/booking')
        .set('Authorization', `Bearer ${data.token}`)
        .send({ roomId: data.room.id });

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        bookingId: expect.any(Number),
      });
    });
  });
});

describe('PUT /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.put('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 403 if user does not have a booking', async () => {
      const data = await createTicketAndPayment();

      const response = await server
        .put('/booking/1')
        .set('Authorization', `Bearer ${data.token}`)
        .send({ roomId: data.room.id });

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 if room has no vacancy', async () => {
      const data = await createTicketAndPayment(false, true, true, true, 0);

      const response = await server
        .put('/booking/1')
        .set('Authorization', `Bearer ${data.token}`)
        .send({ roomId: data.room.id });

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it('should respond with status 404 if room does not exist', async () => {
      const data = await createTicketAndPayment(false, true, true, false);
      const roomId = 0;

      const response = await server
        .put('/booking/1')
        .set('Authorization', `Bearer ${data.token}`)
        .send({ roomId: roomId });

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it('should respond with status 200 and with bookindId', async () => {
      const data = await createTicketAndPayment();
      const booking = await createBookingWithRoom(data.user.id, data.room.id);

      const response = await server
        .put(`/booking/${booking.id}`)
        .set('Authorization', `Bearer ${data.token}`)
        .send({ roomId: data.room.id });

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        bookingId: booking.id,
      });
    });
  });
});

async function createTicketAndPayment(
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
