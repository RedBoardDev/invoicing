import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { response } from './schemas';

const getInvoiceRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'GET',
    url: '/:id',
    schema: {
      tags: ['Invoices'],
      description: 'Get an invoice by id',
      response,
    },
    handler,
  });
};

export default getInvoiceRoute;
