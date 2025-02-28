import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { body } from './schemas';

const createInvoiceRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'POST',
    url: '',
    schema: {
      tags: ['Invoices'],
      description: 'Create an new invoice',
      body,
    },
    handler,
  });
};

export default createInvoiceRoute;
