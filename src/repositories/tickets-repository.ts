import { prisma } from '@/config';
import { TicketType } from '@prisma/client';

async function findTypes(): Promise<TicketType[]> {
  const types = await prisma.ticketType.findMany();
  return types;
}

export const ticketsRepository = {
  findTypes,
};
