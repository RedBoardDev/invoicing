import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { body } from './schemas';

const deleteContractRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'DELETE',
    url: '',
    schema: {
      tags: ['Contracts'],
      description: 'Delete one or multiple contracts by IDs',
      body,
    },
    handler,
  });
};

export default deleteContractRoute;
