import { TicketType } from '@prisma/client';
import { ticketsRepository } from '@/repositories';

async function getTicketTypes(): Promise<getTicketTypesResult> {
  const types = await ticketsRepository.findTypes();
  return types.length === 0 ? {} : types;
}

type getTicketTypesResult = Promise<TicketType[] | {}>;

export const ticketsService = {
  getTicketTypes,
};
