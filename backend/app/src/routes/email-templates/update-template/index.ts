import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { params } from './schemas';

const updateEmailTemplateRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'PUT',
    url: '/:id',
    schema: {
      tags: ['Templates'],
      description: 'Update an email template',
      params,
    },
    handler,
  });
};

export default updateEmailTemplateRoute;
