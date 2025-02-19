import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { body, params, response } from './schemas';

const updateEmailTemplateRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'PUT',
    url: '/:id',
    schema: {
      tags: ['Templates'],
      description: 'Update an email template',
      params,
      body,
      response,
    },
    handler,
  });
};

export default updateEmailTemplateRoute;
