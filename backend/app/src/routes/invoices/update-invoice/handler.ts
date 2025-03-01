import { HttpStatusCode } from '@enums/http-status-enums';
import { updateInvoice } from '@repositories/invoice-repository';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { TBody, TParams } from './schemas';

const handler = async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const { id } = req.params as TParams;
  const body = req.body as TBody;

  const invoice = await updateInvoice(id, body);

  res.success(HttpStatusCode.ok, invoice);
};

export default handler;
