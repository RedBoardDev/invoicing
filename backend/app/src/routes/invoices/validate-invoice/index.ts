import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { body, response } from './schemas';

const validateInvoiceRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'PUT',
    url: '/:id',
    schema: {
      tags: ['Invoices'],
      description: 'Validate an invoice',
      body,
      response,
    },
    handler,
  });
};

export default validateInvoiceRoute;
