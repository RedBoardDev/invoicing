import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { querystring, params } from './schemas';

const listHistoryForContractRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'GET',
    url: '/:contractId/history',
    schema: {
      tags: ['Contracts'],
      description: 'List history entries for a specific contract',
      params,
      querystring,
    },
    handler,
  });
};

export default listHistoryForContractRoute;
