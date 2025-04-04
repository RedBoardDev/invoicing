import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { querystring, params } from './schemas';

const getClientRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'GET',
    url: '/:id',
    schema: {
      tags: ['Clients'],
      description: 'Get a client by id',
      params,
      querystring,
    },
    handler,
  });
};

export default getClientRoute;
