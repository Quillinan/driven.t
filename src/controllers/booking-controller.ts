import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { bookingService } from '@/services';

export async function getBookingByUserId(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  const booking = await bookingService.getWithRoomByUserId(userId);
  res.status(httpStatus.OK).send(booking);
}

export async function createBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body;

  const newBooking = await bookingService.createBooking(userId, roomId);
  res.status(httpStatus.OK).send(newBooking);
}

export async function updateBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body;
  const bookingId = Number(req.params.bookingId);

  const updatedBooking = await bookingService.updateBooking(userId, roomId, bookingId);
  res.status(httpStatus.OK).send(updatedBooking);
}
