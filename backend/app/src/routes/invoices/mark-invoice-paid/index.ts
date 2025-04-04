import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { params } from './schemas';

const markInvoicePaidRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'PATCH',
    url: '/:id/paid',
    schema: {
      tags: ['Invoices'],
      description: 'Mark an invoice as paid',
      params,
    },
    handler,
  });
};

export default markInvoicePaidRoute;
