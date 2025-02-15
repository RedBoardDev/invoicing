import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { body, response } from './schemas';

const listClientsRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'GET',
    url: '/',
    schema: {
      tags: ['Clients'],
      description: 'List clients',
      body,
      response,
    },
    handler,
  });
};

export default listClientsRoute;
