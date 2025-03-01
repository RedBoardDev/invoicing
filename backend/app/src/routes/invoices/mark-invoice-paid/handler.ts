import { HttpStatusCode } from '@enums/http-status-enums';
import { updateInvoice } from '@repositories/invoice-repository';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { TParams } from './schemas';

const handler = async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const { id } = req.params as TParams;

  const invoice = await updateInvoice(id, {
    status: 'PAID',
  });

  res.success(HttpStatusCode.ok, invoice);
};

export default handler;
