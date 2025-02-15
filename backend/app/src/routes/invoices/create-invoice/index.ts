import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { body, response } from './schemas';

const createInvoiceRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'POST',
    url: '/',
    schema: {
      tags: ['Invoices'],
      description: 'Create an new invoice',
      body,
      response,
    },
    handler,
  });
};

export default createInvoiceRoute;
