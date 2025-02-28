import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { body } from './schemas';

const createContractRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'POST',
    url: '',
    schema: {
      tags: ['Contracts'],
      description: 'Create a new contract',
      body,
    },
    handler,
  });
};

export default createContractRoute;
