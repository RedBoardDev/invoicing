import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { body, response } from './schemas';

const updateClientRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'PUT',
    url: '/:id',
    schema: {
      tags: ['Clients'],
      description: 'Update a client',
      body,
      response,
    },
    handler,
  });
};

export default updateClientRoute;
