import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { querystring, response } from './schemas';

const listEmailTemplatesRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'GET',
    url: '',
    schema: {
      tags: ['Templates'],
      description: 'List email templates',
      querystring,
      response,
    },
    handler,
  });
};

export default listEmailTemplatesRoute;
