import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { body, response } from './schemas';

const deleteInvoiceRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'DELETE',
    url: '/:id',
    schema: {
      tags: ['Invoices'],
      description: 'Delete an invoice',
      body,
      response,
    },
    handler,
  });
};

export default deleteInvoiceRoute;
