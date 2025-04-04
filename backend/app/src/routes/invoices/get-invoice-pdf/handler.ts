import { GetObjectCommand } from '@aws-sdk/client-s3';
import { HttpStatusCode } from '@enums/http-status-enums';
import ApiError from '@libs/error-management/api-error';
import S3ClientLib from '@libs/s3-client';
import { getInvoiceById } from '@repositories/invoice-repository';
import { generateInvoicePdf } from '@services/pdf-service';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { TParams } from './schemas';

const handleError = (invoice: { status: string; fileId?: string | null }): void => {
  const validStatuses = ['DRAFT', 'VALIDATED', 'SENT', 'PAID'];

  if (!validStatuses.includes(invoice.status)) {
    throw new ApiError('Statut inconnu', HttpStatusCode.badRequest);
  }

  if (invoice.status !== 'DRAFT' && !invoice.fileId) {
    throw new ApiError('PDF non disponible', HttpStatusCode.notFound);
  }

  if (invoice.status === 'DRAFT' && invoice.fileId) {
    throw new ApiError('Une facture en brouillon ne devrait pas avoir de PDF disponible', HttpStatusCode.badRequest);
  }
};

const getInvoicePdfFromS3 = async (fileId: string): Promise<Buffer> => {
  const s3Lib = S3ClientLib.getInstance();
  const s3Client = s3Lib.getClient();
  const bucketName = s3Lib.getBucketName();
  const key = `invoices/${fileId}.pdf`;

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  const { Body } = await s3Client.send(command);
  if (!Body) {
    throw new ApiError('Fichier non trouvé sur S3', HttpStatusCode.notFound);
  }

  const pdfBuffer = await Body.transformToByteArray();
  return Buffer.from(pdfBuffer);
};

export const handler = async (req: FastifyRequest<{ Params: TParams }>, res: FastifyReply): Promise<void> => {
  const { id } = req.params;

  const invoice = await getInvoiceById(id);

  handleError(invoice);

  if (invoice.status === 'DRAFT') {
    const pdfBuffer = await generateInvoicePdf(invoice);
    return res.header('Content-Type', 'application/pdf').status(HttpStatusCode.ok).send(pdfBuffer);
  }

  const pdfBuffer = await getInvoicePdfFromS3(invoice.fileId as string);

  return res.header('Content-Type', 'application/pdf').status(HttpStatusCode.ok).send(pdfBuffer);
};
