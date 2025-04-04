import type { FastifyInstance } from 'fastify';

import handler from './handler';

const healthRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'GET',
    url: '',
    schema: {
      tags: ['Health'],
      description: 'Health check',
    },
    handler,
  });
};

export default healthRoute;
