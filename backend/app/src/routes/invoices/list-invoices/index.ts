import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { body, response } from './schemas';

const listInvoicesRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'GET',
    url: '/',
    schema: {
      tags: ['Invoices'],
      description: 'List invoices',
      body,
      response,
    },
    handler,
  });
};

export default listInvoicesRoute;
