import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { response } from './schemas';

const validateInvoiceRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'PATCH',
    url: '/:id/validate',
    schema: {
      tags: ['Invoices'],
      description: 'Validate an invoice',
      response,
    },
    handler,
  });
};

export default validateInvoiceRoute;
