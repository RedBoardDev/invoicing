import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { body, response } from './schemas';

const sendInvoiceRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'PUT',
    url: '/',
    schema: {
      tags: ['Invoices'],
      description: 'Send an invoice by email',
      body,
      response,
    },
    handler,
  });
};

export default sendInvoiceRoute;
