import { Router } from 'express';
import { getHotelById, getHotels } from '@/controllers';
import { authenticateToken, validateTicket } from '@/middlewares';

const hotelsRouter = Router();

// Primeiro, aplique a autenticação a todas as rotas dentro de hotelsRouter
hotelsRouter.all('/*', authenticateToken, validateTicket);

// Em seguida, defina as rotas GET
hotelsRouter.get('/', getHotels);
hotelsRouter.get('/:hotelId', getHotelById);

export { hotelsRouter };
