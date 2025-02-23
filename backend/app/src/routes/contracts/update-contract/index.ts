import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { body, params, response } from './schemas';

const updateContractRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'PATCH',
    url: '/:id',
    schema: {
      tags: ['Contracts'],
      description: 'Partially update a contract by ID',
      body,
      params,
      response,
    },
    handler,
  });
};

export default updateContractRoute;
