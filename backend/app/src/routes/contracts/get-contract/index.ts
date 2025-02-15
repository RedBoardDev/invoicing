import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { querystring, response } from './schemas';

const getContractRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'GET',
    url: '/:id',
    schema: {
      tags: ['Contracts'],
      description: 'Get a contract by id',
      querystring,
      response,
    },
    handler,
  });
};

export default getContractRoute;
