import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { body, params } from './schemas';

const updateInvoiceRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'PATCH',
    url: '/:id',
    schema: {
      tags: ['Invoices'],
      description: 'Partially update an invoice by ID',
      body,
      params,
    },
    handler,
  });
};

export default updateInvoiceRoute;
