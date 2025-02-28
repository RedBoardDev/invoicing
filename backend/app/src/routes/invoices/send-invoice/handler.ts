import { HttpStatusCode } from '@enums/http-status-enums';
import ApiError from '@libs/error-management/api-error';
import { type Invoice, InvoiceStatus } from '@prisma/client';
import { getInvoiceById, updateInvoice } from '@repositories/invoice-repository';
import { sendInvoiceEmail } from '@services/email-service';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { TBody, TParams } from './schemas';

const handleError = (invoice: Invoice): void => {
  if (invoice.status === InvoiceStatus.DRAFT)
    throw new ApiError('Cannot send a draft invoice', HttpStatusCode.badRequest, 400);
  if (!invoice.fileId) throw new ApiError('PDF non disponible pour cette facture', HttpStatusCode.badRequest);
  if (invoice.status === InvoiceStatus.SENT)
    throw new ApiError('Cette facture a déjà été envoyée', HttpStatusCode.badRequest);
  if (invoice.status === InvoiceStatus.PAID)
    throw new ApiError('Cette facture a déjà été payée', HttpStatusCode.badRequest);
};

const handler = async (req: FastifyRequest<{ Params: TParams; Body: TBody }>, res: FastifyReply): Promise<void> => {
  const { id } = req.params;
  const { recipientEmail, subject, content } = req.body;

  const invoice = await getInvoiceById(id, { contract: { include: { client: true } } });

  handleError(invoice);

  await sendInvoiceEmail(invoice, { recipientEmail, subject, content }, invoice.fileId as string);

  const updatedInvoice = await updateInvoice(id, {
    status: 'SENT',
    sendDate: new Date().toISOString(),
  });

  res.status(HttpStatusCode.ok).send({
    message: `Facture ${invoice.invoiceNumber} envoyée avec succès`,
    invoice: updatedInvoice,
  });
};
export default handler;
