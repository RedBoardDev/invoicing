import type { FastifyInstance } from 'fastify';
import registerHandler from './handler';
import { body } from './schemas';

const registerRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'POST',
    url: '/register',
    schema: {
      tags: ['Auth'],
      description: 'Route for creating a new user',
      body,
    },
    handler: registerHandler,
  });
};

export default registerRoute;
