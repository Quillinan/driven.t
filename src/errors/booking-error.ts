import { ApplicationError } from '@/protocols';

export function noPermissionToBooking(): ApplicationError {
  return {
    name: 'NoPermissionToBooking',
    message: 'Invalid permission to booking!',
  };
}
