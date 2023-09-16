import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { enrollmentsService } from '@/services';
import { cepQueryValidationSchema } from '@/schemas';

export async function getEnrollmentByUser(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  const enrollmentWithAddress = await enrollmentsService.getOneWithAddressByUserId(userId);

  return res.status(httpStatus.OK).send(enrollmentWithAddress);
}

export async function postCreateOrUpdateEnrollment(req: AuthenticatedRequest, res: Response) {
  await enrollmentsService.createOrUpdateEnrollmentWithAddress({
    ...req.body,
    userId: req.userId,
  });

  return res.sendStatus(httpStatus.OK);
}

// TODO - Receber o CEP do usuário por query params.
export async function getAddressFromCEP(req: AuthenticatedRequest, res: Response) {
  const { cep } = req.query;

  const { error } = cepQueryValidationSchema.validate(cep);

  if (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ error: 'CEP inválido' });
  }

  const address = await enrollmentsService.getAddressFromCEP(cep as string);

  if (address === null) {
    return res.status(httpStatus.BAD_REQUEST).json({ error: 'Endereço não encontrado para o CEP fornecido' });
  }

  res.status(httpStatus.OK).send(address);
}
