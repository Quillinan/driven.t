import { TicketType, Ticket } from '@prisma/client';
import { ticketsRepository } from '@/repositories';

async function getTicketTypes(): Promise<TicketType[]> {
  const types = await ticketsRepository.findTypes();
  return types;
}

async function getTickets(userId: number) {
  const tickets = await ticketsRepository.findTicketsByUserId(userId);
  return tickets;
}

async function createTicket(userId: number, ticketTypeId: number) {
  const resp = await ticketsRepository.create(userId, ticketTypeId);
  return resp;
}

export const ticketsService = {
  getTicketTypes,
  getTickets,
  createTicket,
};
