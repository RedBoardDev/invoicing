import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { response } from './schemas';

const markInvoicePaidRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'PUT',
    url: '/:id/paid',
    schema: {
      tags: ['Invoices'],
      description: 'Mark an invoice as paid',
      response,
    },
    handler,
  });
};

export default markInvoicePaidRoute;
