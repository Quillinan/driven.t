import supertest from 'supertest';
import httpStatus from 'http-status';
import { cleanDb } from '../helpers';
import app, { init } from '@/app';

//beforeAll(async () => {
//  await init();
//  await cleanDb();
//});

const server = supertest(app);

describe('GET /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
});
