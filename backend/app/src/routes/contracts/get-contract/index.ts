import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { response } from './schemas';

const getContractRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'GET',
    url: '/:id',
    schema: {
      tags: ['Contracts'],
      description: 'Get a contract by id',
      response,
    },
    handler,
  });
};

export default getContractRoute;
