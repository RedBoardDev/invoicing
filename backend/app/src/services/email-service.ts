import fs from 'node:fs';
import path from 'node:path';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import S3ClientLib from '@libs/s3-client';
import type { Invoice } from '@prisma/client';
import Handlebars from 'handlebars';
import { EmailBuilder } from './email/email-builder';

const invoiceTemplatePath = path.resolve(__dirname, '../templates/mail/invoice.hbs');
const invoiceTemplate = fs.readFileSync(invoiceTemplatePath, 'utf-8');
const compiledInvoiceTemplate = Handlebars.compile(invoiceTemplate);

export const sendInvoiceEmail = async (
  invoice: Invoice,
  emailData: { recipientEmail: string; subject: string; content: string },
  fileId: string,
): Promise<void> => {
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
    throw new Error('Fichier PDF non trouvé sur S3');
  }

  const pdfBuffer = Buffer.from(await Body.transformToByteArray());
  const formattedContent = emailData.content.replace(/\n/g, '<br>');

  const templateData = {
    invoiceNumber: invoice.invoiceNumber,
    amountHT: invoice.amountHT,
    taxRate: invoice.taxRate,
    dueDate: new Date(invoice.dueDate).toLocaleDateString(),
    subject: emailData.subject,
    content: formattedContent,
  };

  const htmlContent = compiledInvoiceTemplate(templateData);

  await new EmailBuilder()
    .setRecipients([emailData.recipientEmail])
    .setSubject(emailData.subject)
    .setContent(htmlContent)
    .addAttachment({
      filename: `facture-${invoice.invoiceNumber}.pdf`,
      content: pdfBuffer,
    })
    .send();
};
