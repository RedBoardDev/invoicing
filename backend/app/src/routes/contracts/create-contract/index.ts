import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { body, response } from './schemas';

const createContractRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'POST',
    url: '/',
    schema: {
      tags: ['Contracts'],
      description: 'Create a new contract',
      body,
      response,
    },
    handler,
  });
};

export default createContractRoute;
