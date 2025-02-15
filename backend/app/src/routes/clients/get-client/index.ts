import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { params, response } from './schemas';

const getClientRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'GET',
    url: '/:id',
    schema: {
      tags: ['Clients'],
      description: 'Get a client by id',
      params,
      response,
    },
    handler,
  });
};

export default getClientRoute;
