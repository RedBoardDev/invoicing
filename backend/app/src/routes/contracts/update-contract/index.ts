import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { body, params } from './schemas';

const updateContractRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'PATCH',
    url: '/:id',
    schema: {
      tags: ['Contracts'],
      description: 'Partially update a contract by ID',
      body,
      params,
    },
    handler,
  });
};

export default updateContractRoute;
