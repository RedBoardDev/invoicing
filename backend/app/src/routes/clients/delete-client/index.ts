import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { body, response } from './schemas';

const deleteClientRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'DELETE',
    url: '/:id',
    schema: {
      tags: ['Clients'],
      description: 'Delete a client',
      body,
      response,
    },
    handler,
  });
};

export default deleteClientRoute;
