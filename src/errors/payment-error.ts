import { ApplicationError } from '@/protocols';

export function paymentError(): ApplicationError {
  return {
    name: 'PaymentError',
    message: 'Ticket is invalid',
  };
}
