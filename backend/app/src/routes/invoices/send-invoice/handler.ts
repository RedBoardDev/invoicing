import { EmailVariable } from '@enums/email-enums';
import { HttpStatusCode } from '@enums/http-status-enums';
import ApiError from '@libs/error-management/api-error';
import { type EmailTemplate, type Invoice, InvoiceStatus } from '@prisma/client';
import { getInvoiceById } from '@repositories/invoice-repository';
import { EmailBuilder, processEmailTemplate } from '@services/email';
import type { StrictEmailVariables } from '@services/email/email-variables';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { TBody, TParams } from './schemas';

const handleError = (invoice: Invoice): void => {
  if (invoice.status === InvoiceStatus.DRAFT) {
    throw new ApiError('Cannot send a draft invoice', HttpStatusCode.badRequest, 400);
  }
};

async function emailHandler(emailTemplate: EmailTemplate, variables: StrictEmailVariables, userEmail: string) {
  try {
    const content = processEmailTemplate(emailTemplate.content, variables);
    const subject = processEmailTemplate(emailTemplate.subject, variables);

    await new EmailBuilder().setRecipients([userEmail]).setSubject(subject).setContent(content).send();
  } catch (error) {
    throw new ApiError('Failed to send email', HttpStatusCode.internalServerError, 500, { originalError: error });
  }
}

const handler = async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const { id } = req.params as TParams;
  const { emailTemplateId, email } = req.body as TBody;

  const invoice = (await getInvoiceById(id, { contract: { include: { client: true } } })) as Invoice & {
    contract: { client: { email: string } };
  };

  handleError(invoice);
  console.log('invoice', invoice);

  // const emailTemplate = await getEmailTemplateById(emailTemplateId);

  const variables: StrictEmailVariables = {
    [EmailVariable.INVOICE_NUMBER]: invoice.invoiceNumber,
    [EmailVariable.INVOICE_DATE]: invoice.createdAt.toISOString(),
    [EmailVariable.DUE_DATE]: invoice.dueDate.toISOString(),
    [EmailVariable.TOTAL_AMOUNT]: invoice.totalAmount.toString(),
    [EmailVariable.EMAIL_EMAIL]: invoice.contract.client.email,
  };

  // console.log('emailTemplate', emailTemplate);
  console.log('variables', variables);
  console.log('email', email);

  // emaimHandler(emailTemplate, variables, invoice.userEmail);

  // Simulation d'envoi d'email
  // const pdfUrl = `https://storage.example.com/invoices/${id}.pdf`;

  // const invoice = await updateInvoice(id, {
  //   status: 'SENT',
  //   sendDate: new Date().toISOString(),
  //   pdfUrl,
  // });

  // res.status(HttpStatusCode.ok).send({
  //   message: `Invoice ${invoice.invoiceNumber} sent successfully`,
  //   pdfUrl,
  // });
  res.status(HttpStatusCode.ok).send({
    message: `Invoice ${invoice.invoiceNumber} sent successfully`,
    pdfUrl: 'https://storage.example.com/invoices/123.pdf',
  });
};

export default handler;
