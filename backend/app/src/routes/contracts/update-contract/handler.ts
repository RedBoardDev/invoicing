import type { UpdateContractData } from '@entities/contract-entity';
import { HttpStatusCode } from '@enums/http-status-enums';
import { updateContract } from '@repositories/contract-repository';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { TParams } from './schemas';

const handleError = (body: UpdateContractData): void => {
  if (body.amountHT !== undefined && body.amountHT < 0) {
    throw new Error('amountHT must be greater than or equal to 0');
  }
  if (body.amountTTC !== undefined && body.amountTTC < 0) {
    throw new Error('amountTTC must be greater than or equal to 0');
  }
  if (body.paymentDelayDays !== undefined && body.paymentDelayDays < 0) {
    throw new Error('paymentDelayDays must be greater than or equal to 0');
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

  handleError(body);

  const contract = await updateContract(id, body);

  res.status(HttpStatusCode.ok).send(contract);
};

export default handler;
