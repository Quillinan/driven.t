import { TicketStatus } from '@prisma/client';
import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from './authentication-middleware';
import { hotelsRepository, ticketsRepository } from '@/repositories';
import { invalidDataError, notFoundError, paymentError } from '@/errors';

export async function validateTicket(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const userId = req.userId;
  const enrollment = await hotelsRepository.findUserEnrollment(userId);

  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket) {
    throw notFoundError();
  }

  const ticketId = ticket.id;

  const ticketData = await ticketsRepository.findTicketById(ticketId);

  if (
    ticketData.status !== TicketStatus.PAID ||
    ticketData.TicketType.isRemote ||
    !ticketData.TicketType.includesHotel
  ) {
    throw paymentError();
  }

  // if (!ticketData.TicketType.includesHotel) {
  //   throw paymentError();
  // }

  // if (ticketData.TicketType.isRemote) {
  //   throw paymentError();
  // }

  // if (ticketData.status !== TicketStatus.PAID) {
  //   throw paymentError();
  // }

  next();
}
