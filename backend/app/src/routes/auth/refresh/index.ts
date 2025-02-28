import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { body } from './schemas';

const refreshRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'POST',
    url: '/refresh',
    schema: {
      tags: ['Auth'],
      description: 'Renew access and refresh tokens',
      body,
    },
    handler,
  });
};

export default refreshRoute;
