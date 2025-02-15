import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { response } from './schemas';

const listInvoicesRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'GET',
    url: '',
    schema: {
      tags: ['Invoices'],
      description: 'List invoices',
      response,
    },
    handler,
  });
};

export default listInvoicesRoute;
