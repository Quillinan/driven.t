import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getAllTicketTypes } from '@/controllers';

const ticketsRouter = Router();

ticketsRouter.all('/*', authenticateToken).get('/types', getAllTicketTypes);

export { ticketsRouter };