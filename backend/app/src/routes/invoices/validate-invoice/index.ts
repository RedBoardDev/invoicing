import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { params } from './schemas';

const validateInvoiceRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'PATCH',
    url: '/:id/validate',
    schema: {
      tags: ['Invoices'],
      description: 'Validate an invoice',
      params,
    },
    handler,
  });
};

export default validateInvoiceRoute;
