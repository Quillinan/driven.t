import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getAllTicketTypes, getAllTickets, postTicket } from '@/controllers';
import { ticketTypeSchema } from '@/schemas/tickets-schemas';

const ticketsRouter = Router();

ticketsRouter.all('/*', authenticateToken);
ticketsRouter.get('/types', getAllTicketTypes);
ticketsRouter.get('/', getAllTickets);
ticketsRouter.post('/', validateBody(ticketTypeSchema), postTicket);

export { ticketsRouter };
