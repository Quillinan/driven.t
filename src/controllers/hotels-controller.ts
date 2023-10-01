import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { hotelsService } from '@/services';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const hotels = await hotelsService.findHotels();
  return res.status(httpStatus.OK).send(hotels);
}

export async function getHotelById(req: AuthenticatedRequest, res: Response) {
  const { hotelId } = req.params;
  const ticket = await hotelsService.getHotelByHotelId(hotelId);
  res.status(httpStatus.OK).send(ticket);
}
