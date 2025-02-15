import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { body, response } from './schemas';

const listContractsRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'GET',
    url: '/',
    schema: {
      tags: ['Contracts'],
      description: 'List contracts',
      body,
      response,
    },
    handler,
  });
};

export default listContractsRoute;
