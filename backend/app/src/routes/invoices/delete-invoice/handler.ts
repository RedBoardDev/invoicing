import { HttpStatusCode } from '@enums/http-status-enums';
import { deleteInvoice } from '@repositories/invoice-repository';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { TParams } from './schemas';

const handler = async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const { id } = req.params as TParams;

  const invoice = await deleteInvoice(id);

  res.status(HttpStatusCode.ok).send({
    id: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
  });
};

export default handler;
