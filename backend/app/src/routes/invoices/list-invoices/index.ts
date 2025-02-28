import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { querystring } from './schemas';

const listInvoicesRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'GET',
    url: '',
    schema: {
      tags: ['Invoices'],
      description: 'List invoices',
      querystring,
    },
    handler,
  });
};

export default listInvoicesRoute;
