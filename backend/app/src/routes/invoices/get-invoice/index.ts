import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { body, response } from './schemas';

const getInvoiceRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'GET',
    url: '/:id',
    schema: {
      tags: ['Invoices'],
      description: 'Get an invoice by id',
      body,
      response,
    },
    handler,
  });
};

export default getInvoiceRoute;
