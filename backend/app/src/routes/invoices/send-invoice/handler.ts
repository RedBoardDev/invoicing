import { HttpStatusCode } from '@enums/http-status-enums';
import { updateInvoice } from '@repositories/invoice-repository';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { TParams } from './schemas';

const handler = async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const { id } = req.params as TParams;

  // Simulation d'envoi d'email
  const pdfUrl = `https://storage.example.com/invoices/${id}.pdf`;

  const invoice = await updateInvoice(id, {
    status: 'SENT',
    sendDate: new Date().toISOString(),
    pdfUrl,
  });

  res.status(HttpStatusCode.ok).send({
    message: `Invoice ${invoice.invoiceNumber} sent successfully`,
    pdfUrl,
  });
};

export default handler;
