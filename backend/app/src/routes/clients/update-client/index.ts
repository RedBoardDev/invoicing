import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { body, params, response } from './schemas';

const updateClientRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'PUT',
    url: '/:id',
    schema: {
      tags: ['Clients'],
      description: 'Update a client',
      params,
      body,
      response,
    },
    handler,
  });
};

export default updateClientRoute;
