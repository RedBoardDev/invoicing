import { EmailVariable } from '@enums/email-enums';
import { HttpStatusCode } from '@enums/http-status-enums';
import { formatDateToFrench } from '@libs/utils';
import type { Prisma } from '@prisma/client';
import { getEmailTemplateById } from '@repositories/email-template-repository';
import { getInvoiceById } from '@repositories/invoice-repository';
import { processEmailTemplate } from '@services/email';
import type { StrictEmailVariables } from '@services/email/email-variables';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { TParams } from './schemas';

type InvoiceWithRelations = Prisma.InvoiceGetPayload<{
  include: {
    contract: {
      include: {
        client: true;
      };
    };
  };
}>;

const handler = async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const { id, invoiceId } = req.params as TParams;

  const template = await getEmailTemplateById(id);

  const invoice = (await getInvoiceById(invoiceId, {
    contract: { include: { client: true } },
  })) as InvoiceWithRelations;

  const variables: StrictEmailVariables = {
    [EmailVariable.INVOICE_NUMBER]: invoice.invoiceNumber,
    [EmailVariable.INVOICE_DATE]: formatDateToFrench(invoice.createdAt),
    [EmailVariable.TAX_RATE]: invoice.contract.taxRate.toString(),
    [EmailVariable.DUE_DATE]: invoice.dueDate ? formatDateToFrench(invoice.dueDate) : '',
    [EmailVariable.PAYMENT_DELAY]: invoice.paymentDelay.toString(),
    [EmailVariable.CLIENT_NAME]: invoice.contract.client.name,
    [EmailVariable.CONTRACT_PAYMENT_DELAY]: invoice.contract.paymentDelay.toString(),
    [EmailVariable.CONTRACT_TITLE]: invoice.contract.title,
  };

  const content = processEmailTemplate(template.content, variables);
  const subject = processEmailTemplate(template.subject, variables);

  res.success(HttpStatusCode.ok, { email: invoice.contract.client.email, content, subject });
};

export default handler;
