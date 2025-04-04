import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { querystring } from './schemas';

const listContractsRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'GET',
    url: '',
    schema: {
      tags: ['Contracts'],
      description: 'List contracts',
      querystring,
    },
    handler,
  });
};

export default listContractsRoute;
