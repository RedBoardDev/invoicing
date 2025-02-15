import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { body, response } from './schemas';

const deleteContractRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'DELETE',
    url: '/:id',
    schema: {
      tags: ['Contracts'],
      description: 'Delete a contract',
      body,
      response,
    },
    handler,
  });
};

export default deleteContractRoute;
