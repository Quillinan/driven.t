import supertest from 'supertest';
import httpStatus from 'http-status';
import { cleanDb, generateValidToken } from '../helpers';
import { createBookingWithRoom } from '../factories/booking-factory';
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
    it('should respond with status 404 if there is no booking for given token', async () => {
      const data = await createBookingWithRoom();
      const token = await generateValidToken(data.user);
      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      const formattedDates = {
        ...data.result.Room,
        createdAt: data.result.Room.createdAt.toISOString(),
        updatedAt: data.result.Room.updatedAt.toISOString(),
      };

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({ id: data.result.id, Room: formattedDates });
    });
  });
});
