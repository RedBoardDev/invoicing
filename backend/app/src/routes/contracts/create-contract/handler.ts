import type { CreateContractData } from '@entities/contract-entity';
import { HttpStatusCode } from '@enums/http-status-enums';
import { createContract } from '@repositories/contract-repository';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { TBody } from './schemas';

const handleError = (body: CreateContractData): void => {
  if (body.amountHT < 0) {
    throw new Error('AmountHT must be greater than or equal to 0');
  }
  if (body.paymentDelay < 0) {
    throw new Error('paymentDelay must be greater than or equal to 0');
  }

  const startDate = new Date(body.startDate);
  const endDate = new Date(body.endDate);
  if (Number.isNaN(startDate.getTime())) {
    throw new Error('Invalid startDate format');
  }
  if (Number.isNaN(endDate.getTime())) {
    throw new Error('Invalid endDate format');
  }
  if (endDate < startDate) {
    throw new Error('endDate must be greater than or equal to startDate');
  }
};

const handler = async (req: FastifyRequest<{ Body: CreateContractData }>, res: FastifyReply): Promise<void> => {
  const body = req.body as TBody;

  handleError(body);

  const contract = await createContract(body);

  res.success(HttpStatusCode.created, contract);
};
export default handler;
