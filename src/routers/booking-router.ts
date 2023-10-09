import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { createBooking, getBookingByUserId, updateBooking } from '@/controllers';
import { createBookingSchema } from '@/schemas';

const bookingRouter = Router();

bookingRouter
  .all('/*', authenticateToken)

  .get('/', getBookingByUserId)
  .post('/', validateBody(createBookingSchema), createBooking)
  .put('/:bookingId', validateBody(createBookingSchema), updateBooking);

export { bookingRouter };
