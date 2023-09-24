import { Address, Enrollment } from '@prisma/client';
import { request } from '@/utils/request';
<<<<<<< HEAD
import { requestError } from '@/errors';
import { addressRepository, CreateAddressParams, enrollmentRepository, CreateEnrollmentParams } from '@/repositories';
import { exclude } from '@/utils/prisma-utils';
import { cepQueryValidationSchema } from '@/schemas';

async function getAddressFromCEP(cep: string) {
  const { error } = cepQueryValidationSchema.validate(cep);

  if (error) throw requestError(400, 'CEP inválido');

  const result = await request.get(`${process.env.VIA_CEP_API}/${cep}/json/`);

  if (result.status === 200) {
    const data = result.data;

    if (data.erro === true) throw requestError(400, 'CEP inválido');

    data.cidade = data.localidade;
    delete data.localidade;
    const { uf, ...address } = data;
    const reorderedAddress = { ...address, uf };
    return exclude(reorderedAddress, 'cep', 'ibge', 'gia', 'ddd', 'siafi');
  }
=======
import { enrollmentNotFoundError, invalidCepError } from '@/errors';
import { addressRepository, CreateAddressParams, enrollmentRepository, CreateEnrollmentParams } from '@/repositories';
import { exclude } from '@/utils/prisma-utils';
import { AddressEnrollment } from '@/protocols';

async function getAddressFromCEP(cep: string): Promise<AddressEnrollment> {
  const result = await request.get(`${process.env.VIA_CEP_API}/${cep}/json/`);

  if (!result.data || result.data.erro) {
    throw invalidCepError();
  }

  const { bairro, localidade, uf, complemento, logradouro } = result.data;
  const address: AddressEnrollment = {
    bairro,
    cidade: localidade,
    uf,
    complemento,
    logradouro,
  };

  return address;
>>>>>>> master
}

async function getOneWithAddressByUserId(userId: number): Promise<GetOneWithAddressByUserIdResult> {
  const enrollmentWithAddress = await enrollmentRepository.findWithAddressByUserId(userId);

<<<<<<< HEAD
  if (!enrollmentWithAddress) throw requestError(400, 'Endereço não encontrado');
=======
  if (!enrollmentWithAddress) throw enrollmentNotFoundError();
>>>>>>> master

  const [firstAddress] = enrollmentWithAddress.Address;
  const address = getFirstAddress(firstAddress);

  return {
    ...exclude(enrollmentWithAddress, 'userId', 'createdAt', 'updatedAt', 'Address'),
    ...(!!address && { address }),
  };
}

type GetOneWithAddressByUserIdResult = Omit<Enrollment, 'userId' | 'createdAt' | 'updatedAt'>;

function getFirstAddress(firstAddress: Address): GetAddressResult {
  if (!firstAddress) return null;

  return exclude(firstAddress, 'createdAt', 'updatedAt', 'enrollmentId');
}

type GetAddressResult = Omit<Address, 'createdAt' | 'updatedAt' | 'enrollmentId'>;

async function createOrUpdateEnrollmentWithAddress(params: CreateOrUpdateEnrollmentWithAddress) {
  const enrollment = exclude(params, 'address');
  enrollment.birthday = new Date(enrollment.birthday);
  const address = getAddressForUpsert(params.address);

  await getAddressFromCEP(address.cep);

  const newEnrollment = await enrollmentRepository.upsert(params.userId, enrollment, exclude(enrollment, 'userId'));

  await addressRepository.upsert(newEnrollment.id, address, address);
}

function getAddressForUpsert(address: CreateAddressParams) {
  return {
    ...address,
    ...(address?.addressDetail && { addressDetail: address.addressDetail }),
  };
}

export type CreateOrUpdateEnrollmentWithAddress = CreateEnrollmentParams & {
  address: CreateAddressParams;
};

export const enrollmentsService = {
  getOneWithAddressByUserId,
  createOrUpdateEnrollmentWithAddress,
  getAddressFromCEP,
};