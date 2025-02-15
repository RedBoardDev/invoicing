import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { body, response } from './schemas';

const updateInvoiceRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'PUT',
    url: '/:id',
    schema: {
      tags: ['Invoices'],
      description: 'Update an invoice',
      body,
      response,
    },
    handler,
  });
};

export default updateInvoiceRoute;
