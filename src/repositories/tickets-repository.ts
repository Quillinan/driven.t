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

  const resp = {
    id: ticket.id,
    status: ticket.status,
    ticketTypeId: ticket.ticketTypeId,
    enrollmentId: ticket.enrollmentId,
    TicketType: {
      id: ticketType.id,
      name: ticketType.name,
      price: ticketType.price,
      isRemote: ticketType.isRemote,
      includesHotel: ticketType.includesHotel,
      createdAt: ticketType.createdAt,
      updatedAt: ticketType.updatedAt,
    },
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
  };

  return resp;
}

async function create(userId: number, ticketTypeId: number) {
  if (!ticketTypeId) {
    throw notFoundError();
  }
  const enrollments = await prisma.enrollment.findFirst({
    where: {
      userId,
    },
    include: {
      Address: true,
    },
  });

  if (!enrollments) {
    throw notFoundError();
  }

  const ticketType = await prisma.ticketType.findUnique({
    where: {
      id: Number(ticketTypeId),
    },
  });

  const ticket = await prisma.ticket.create({
    data: {
      enrollmentId: enrollments.id,
      ticketTypeId: Number(ticketTypeId),
      status: 'RESERVED',
    },
  });

  const resp = {
    id: ticket.id,
    status: ticket.status,
    ticketTypeId: ticket.ticketTypeId,
    enrollmentId: ticket.enrollmentId,
    TicketType: {
      id: ticketType.id,
      name: ticketType.name,
      price: ticketType.price,
      isRemote: ticketType.isRemote,
      includesHotel: ticketType.includesHotel,
      createdAt: ticketType.createdAt,
      updatedAt: ticketType.updatedAt,
    },
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
  };

  return resp;
}

export const ticketsRepository = {
  findTypes,
  findTicketsByUserId,
  create,
};
