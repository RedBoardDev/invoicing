import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { body, params } from './schemas';

const updateClientRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'PATCH',
    url: '/:id',
    schema: {
      tags: ['Clients'],
      description: 'Partially update a client by ID',
      body,
      params,
    },
    handler,
  });
};

export default updateClientRoute;
