import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { response } from './schemas';

const getHistoryContractRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'GET',
    url: '/:id',
    schema: {
      tags: ['Contracts'],
      description: 'Get history of a contract by id',
      response,
    },
    handler,
  });
};

export default getHistoryContractRoute;
