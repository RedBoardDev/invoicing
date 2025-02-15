import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { body, response } from './schemas';

const createClientRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'POST',
    url: '',
    schema: {
      tags: ['Clients'],
      description: 'Create a new client',
      body,
      response,
    },
    handler,
  });
};

export default createClientRoute;
