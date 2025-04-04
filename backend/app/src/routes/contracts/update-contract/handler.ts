import type { UpdateContractData } from '@entities/contract-entity';
import { ErrorsEnum } from '@enums/errors-enums';
import { HttpStatusCode } from '@enums/http-status-enums';
import ApiError from '@libs/error-management/api-error';
import { updateContract } from '@repositories/contract-repository';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { TParams } from './schemas';

const handleValidation = (body: UpdateContractData): void => {
  if (body.amountHT !== undefined && body.amountHT < 0) {
    throw new Error('amountHT must be greater than or equal to 0');
  }
  if (body.taxRate !== undefined && body.taxRate < 0) {
    throw new Error('taxRate must be greater than or equal to 0');
  }
  if (body.paymentDelay !== undefined && body.paymentDelay < 0) {
    throw new Error('paymentDelay must be greater than or equal to 0');
  }

  const startDate = body.startDate ? new Date(body.startDate) : null;
  const endDate = body.endDate ? new Date(body.endDate) : null;

  if (startDate && Number.isNaN(startDate.getTime())) {
    throw new Error('Invalid startDate format');
  }
  if (endDate && Number.isNaN(endDate.getTime())) {
    throw new Error('Invalid endDate format');
  }
  if (startDate && endDate && endDate < startDate) {
    throw new Error('endDate must be after startDate');
  }
};

const handler = async (
  req: FastifyRequest<{ Params: TParams; Body: UpdateContractData }>,
  res: FastifyReply,
): Promise<void> => {
  const { id } = req.params;
  const body = req.body;

  try {
    handleValidation(body);
  } catch (error) {
    if (error instanceof Error) {
      throw new ApiError(error.message, HttpStatusCode.badRequest, ErrorsEnum.badRequest);
    }
    throw error;
  }

  const contract = await updateContract(id, body);

  res.success(HttpStatusCode.ok, contract);
};

export default handler;
