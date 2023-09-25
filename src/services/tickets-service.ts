import { TicketType } from '@prisma/client';
import { ticketsRepository } from '@/repositories';

async function getTicketTypes() {
  const types = await ticketsRepository.findTypes();
  return types;
}

async function getTickets(userId: number) {
  const tickets = await ticketsRepository.findTicketsByUserId(userId);
  return tickets;
}

export const ticketsService = {
  getTicketTypes,
  getTickets,
};
