import createInvoiceRoute from '@routes/invoices/create-invoice';
import deleteInvoiceRoute from '@routes/invoices/delete-invoice';
import getInvoiceRoute from '@routes/invoices/get-invoice';
import listInvoicesRoute from '@routes/invoices/list-invoices';
import sendInvoiceRoute from '@routes/invoices/send-invoice';
import updateInvoiceRoute from '@routes/invoices/update-invoice';
import validateInvoiceRoute from '@routes/invoices/validate-invoice';
import type { FastifyInstance } from 'fastify';

const invoicesRoutes = async (app: FastifyInstance): Promise<void> => {
  app.register(createInvoiceRoute);
  app.register(deleteInvoiceRoute);
  app.register(getInvoiceRoute);
  app.register(listInvoicesRoute);
  app.register(updateInvoiceRoute);
  app.register(sendInvoiceRoute);
  app.register(validateInvoiceRoute);
};

export default invoicesRoutes;
