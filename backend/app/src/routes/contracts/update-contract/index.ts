import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { body, response } from './schemas';

const updateContractRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'PUT',
    url: '/:id',
    schema: {
      tags: ['Contracts'],
      description: 'Update a contract',
      body,
      response,
    },
    handler,
  });
};

export default updateContractRoute;
