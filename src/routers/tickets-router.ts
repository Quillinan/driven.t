import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getAllTicketTypes, getAllTickets } from '@/controllers';

const ticketsRouter = Router();

ticketsRouter.get('/types', authenticateToken, getAllTicketTypes);
ticketsRouter.get('/', authenticateToken, getAllTickets);

export { ticketsRouter };
