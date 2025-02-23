import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { querystring, params, response } from './schemas';

const listInvoicesForContractRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'GET',
    url: '/:contractId/invoices',
    schema: {
      tags: ['Contracts'],
      description: 'List invoices for a specific contract',
      params,
      querystring,
      response,
    },
    handler,
  });
};

export default listInvoicesForContractRoute;
