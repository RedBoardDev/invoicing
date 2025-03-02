import { HttpStatusCode } from '@enums/http-status-enums';
import ApiError from '@libs/error-management/api-error';
import type { Invoice } from '@prisma/client';
import { getInvoiceById, updateInvoice } from '@repositories/invoice-repository';
import { generateInvoicePdf } from '@services/pdf-service';
import { uploadPdfToS3 } from '@services/s3-service';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { TParams } from './schemas';

const handlerError = (invoice: Invoice): void => {
  if (invoice.status !== 'DRAFT') {
    throw new ApiError('Seules les factures en brouillon peuvent être validées', HttpStatusCode.badRequest);
  }
};

const handler = async (req: FastifyRequest<{ Params: TParams }>, res: FastifyReply): Promise<void> => {
  const { id } = req.params;

  const invoice = await getInvoiceById(id);

  handlerError(invoice);

  const pdfBuffer = await generateInvoicePdf(invoice);
  const fileId = await uploadPdfToS3(pdfBuffer);

  const updatedInvoice = await updateInvoice(id, {
    status: 'VALIDATED',
    fileId,
    dueDate: new Date(new Date().getTime() + invoice.paymentDelay * 24 * 60 * 60 * 1000).toISOString(),
  });

  res.success(HttpStatusCode.ok, updatedInvoice);
};

export default handler;
