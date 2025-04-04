import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { body, params } from './schemas';

const sendInvoiceRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'PUT',
    url: '/:id/send',
    schema: {
      tags: ['Invoices'],
      description: 'Send an invoice by email',
      body,
      params,
    },
    handler,
  });
};

export default sendInvoiceRoute;
