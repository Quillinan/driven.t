import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { createBooking, getBookingByUserId } from '@/controllers';
import { createBookingSchema } from '@/schemas';

const bookingRouter = Router();

bookingRouter
  .all('/*', authenticateToken)

  .get('/', getBookingByUserId)
  .post('/', validateBody(createBookingSchema), createBooking);

export { bookingRouter };
