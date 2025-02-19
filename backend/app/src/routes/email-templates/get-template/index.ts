import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { querystring, params, response } from './schemas';

const getEmailTemplateRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'GET',
    url: '/:id',
    schema: {
      tags: ['Templates'],
      description: 'Get an email template by id',
      params,
      querystring,
      response,
    },
    handler,
  });
};

export default getEmailTemplateRoute;
