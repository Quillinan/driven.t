import { TicketType } from '@prisma/client';
import { ticketsRepository } from '@/repositories';

async function getTicketTypes() {
  const types = await ticketsRepository.findTypes();
  return types;
}

export const ticketsService = {
  getTicketTypes,
};
