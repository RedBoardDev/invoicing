import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { querystring, params } from './schemas';

const getContractRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'GET',
    url: '/:id',
    schema: {
      tags: ['Contracts'],
      description: 'Get a contract by id',
      params,
      querystring,
    },
    handler,
  });
};

export default getContractRoute;
