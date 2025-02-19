import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { params, response } from './schemas';

const deleteEmailTemplateRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'DELETE',
    url: '',
    schema: {
      tags: ['Templates'],
      description: 'Delete one or multiple email template by IDs',
      params,
      response,
    },
    handler,
  });
};

export default deleteEmailTemplateRoute;
