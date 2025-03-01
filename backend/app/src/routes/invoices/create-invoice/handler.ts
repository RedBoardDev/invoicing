import { HttpStatusCode } from '@enums/http-status-enums';
import { generateNextInvoiceNumber } from '@libs/invoice-number';
import { createInvoice } from '@repositories/invoice-repository';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { TBody } from './schemas';

const handler = async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const body = req.body as TBody;

  const invoiceNumber = await generateNextInvoiceNumber();

  const invoiceData = {
    ...body,
    invoiceNumber,
  };

  const invoice = await createInvoice(invoiceData);

  res.success(HttpStatusCode.created, invoice);
};

export default handler;
