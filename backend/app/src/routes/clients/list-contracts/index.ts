import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { querystring, params, response } from './schemas';

const listContractsForClientRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'GET',
    url: '/:clientId/contracts',
    schema: {
      tags: ['Clients'],
      description: 'List contracts for a specific client',
      params,
      querystring,
      response,
    },
    handler,
  });
};

export default listContractsForClientRoute;
