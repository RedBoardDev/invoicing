import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { querystring } from './schemas';

const listEmailTemplatesRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'GET',
    url: '',
    schema: {
      tags: ['Templates'],
      description: 'List email templates',
      querystring,
    },
    handler,
  });
};

export default listEmailTemplatesRoute;
