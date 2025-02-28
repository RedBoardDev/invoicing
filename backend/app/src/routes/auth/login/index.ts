import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { body } from './schemas';

const loginRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'POST',
    url: '/login',
    schema: {
      tags: ['Auth'],
      description: 'Login to obtain access and refresh tokens',
      body,
    },
    handler,
  });
};

export default loginRoute;
