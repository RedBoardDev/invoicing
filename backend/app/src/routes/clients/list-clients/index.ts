import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { querystring } from './schemas';

const listClientsRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'GET',
    url: '',
    schema: {
      tags: ['Clients'],
      description: 'List clients',
      querystring,
    },
    handler,
  });
};

export default listClientsRoute;
