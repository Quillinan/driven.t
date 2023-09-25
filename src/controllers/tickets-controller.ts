import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { ticketsService } from '@/services';

export async function getAllTicketTypes(req: AuthenticatedRequest, res: Response) {
  const types = await ticketsService.getTicketTypes();

  res.status(httpStatus.OK).json(types);
}

export async function getAllTickets(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  const tickets = await ticketsService.getTickets(userId);
  res.status(httpStatus.OK).send(tickets);
}

