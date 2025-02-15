import { HttpStatusCode } from '@enums/http-status-enums';
import { createInvoice } from '@repositories/invoice-repository';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { TBody } from './schemas';

const handler = async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const body = req.body as TBody;

  const invoiceData = {
    ...body,
    items: body.items.map((item) => ({
      description: item.description,
      amount: item.amount,
    })),
  };

  const invoice = await createInvoice(invoiceData);

  res.status(HttpStatusCode.created).send(invoice);
};

export default handler;
