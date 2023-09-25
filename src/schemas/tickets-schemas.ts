import { TicketType } from '@/protocols';
import Joi from 'joi';

export const ticketTypeSchema = Joi.object<TicketType>({
  ticketTypeId: Joi.number().required(),
});