import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { querystring, response } from './schemas';

const listClientsRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'GET',
    url: '',
    schema: {
      tags: ['Clients'],
      description: 'List clients',
      querystring,
      response,
    },
    handler,
  });
};

export default listClientsRoute;
