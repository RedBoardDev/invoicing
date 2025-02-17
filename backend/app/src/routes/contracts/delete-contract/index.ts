import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { body, response } from './schemas';

const deleteContractRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'DELETE',
    url: '',
    schema: {
      tags: ['Contracts'],
      description: 'Delete one or multiple contracts by IDs',
      body,
      response,
    },
    handler,
  });
};

export default deleteContractRoute;
