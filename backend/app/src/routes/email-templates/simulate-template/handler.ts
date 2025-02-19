import { EmailVariable } from '@enums/email-enums';
import { HttpStatusCode } from '@enums/http-status-enums';
import type { Invoice } from '@prisma/client';
import { getEmailTemplateById } from '@repositories/email-template-repository';
import { getInvoiceById } from '@repositories/invoice-repository';
import { processEmailTemplate } from '@services/email';
import type { StrictEmailVariables } from '@services/email/email-variables';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { TParams } from './schemas';

const handler = async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const { id, invoiceId } = req.params as TParams;

  const template = await getEmailTemplateById(id);

  const invoice = (await getInvoiceById(invoiceId, { contract: { include: { client: true } } })) as Invoice & {
    contract: { client: { email: string } };
  };

  const variables: StrictEmailVariables = {
    [EmailVariable.INVOICE_NUMBER]: invoice.invoiceNumber,
    [EmailVariable.INVOICE_DATE]: invoice.createdAt.toISOString(),
    [EmailVariable.DUE_DATE]: invoice.dueDate.toISOString(),
    [EmailVariable.TOTAL_AMOUNT]: invoice.totalAmount.toString(),
    [EmailVariable.EMAIL_EMAIL]: invoice.contract.client.email,
  };

  const content = processEmailTemplate(template.content, variables);
  const subject = processEmailTemplate(template.subject, variables);

  res.status(HttpStatusCode.ok).send({ email: invoice.contract.client.email, content, subject });
};

export default handler;
