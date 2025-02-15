import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { response } from './schemas';

const listContractsRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'GET',
    url: '/',
    schema: {
      tags: ['Contracts'],
      description: 'List contracts',
      response,
    },
    handler,
  });
};

export default listContractsRoute;
