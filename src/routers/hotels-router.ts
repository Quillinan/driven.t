import { Router } from 'express';
import { getHotelById, getHotels } from '@/controllers';
import { authenticateToken, validateTicket } from '@/middlewares';

const hotelsRouter = Router();

// middlewares
hotelsRouter.all('/*', authenticateToken, validateTicket);

//GET
hotelsRouter.get('/', getHotels);
hotelsRouter.get('/:hotelId', getHotelById);

export { hotelsRouter };
