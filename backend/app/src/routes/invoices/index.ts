import createInvoiceRoute from '@routes/invoices/create-invoice';
import deleteInvoiceRoute from '@routes/invoices/delete-invoice';
import getInvoiceRoute from '@routes/invoices/get-invoice';
import listInvoicesRoute from '@routes/invoices/list-invoices';
import updateInvoiceRoute from '@routes/invoices/update-invoice';
import type { FastifyInstance } from 'fastify';

const invoicesRoutes = async (app: FastifyInstance): Promise<void> => {
  app.register(createInvoiceRoute);
  app.register(deleteInvoiceRoute);
  app.register(getInvoiceRoute);
  app.register(listInvoicesRoute);
  app.register(updateInvoiceRoute);
};

export default invoicesRoutes;
