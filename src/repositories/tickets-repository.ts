import { prisma } from '@/config';
import { notFoundError } from '@/errors';

async function findTypes() {
  const types = await prisma.ticketType.findMany();
  return types;
}

async function findTicketsByUserId(userId: number) {
  const enrollments = await prisma.enrollment.findFirst({
    where: {
      userId,
    },
    include: {
      Address: true,
    },
  });

  if (!enrollments) throw notFoundError();

  const ticket = await prisma.ticket.findUnique({ where: { enrollmentId: enrollments.id } });

  if (!ticket) throw notFoundError();

  const ticketType = await prisma.ticketType.findUnique({
    where: {
      id: ticket.ticketTypeId,
    },
  });

  const resp = { ...ticket, ticketType };

  return resp;
}

export const ticketsRepository = {
  findTypes,
  findTicketsByUserId,
};
