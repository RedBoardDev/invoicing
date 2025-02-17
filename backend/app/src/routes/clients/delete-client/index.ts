import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { params, response } from './schemas';

const deleteClientRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'DELETE',
    url: '',
    schema: {
      tags: ['Clients'],
      description: 'Delete one or multiple clients by IDs',
      params,
      response,
    },
    handler,
  });
};

export default deleteClientRoute;
