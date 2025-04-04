import { HttpStatusCode } from '@enums/http-status-enums';
import { previewInvoiceNumber } from '@libs/invoice-number';
import type { FastifyReply, FastifyRequest } from 'fastify';

const handler = async (_req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const invoiceNumber = await previewInvoiceNumber();

  res.success(HttpStatusCode.ok, { invoiceNumber });
};

export default handler;
