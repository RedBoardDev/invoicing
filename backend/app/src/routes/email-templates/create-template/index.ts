import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { body, response } from './schemas';

const createEmailTemplateRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'POST',
    url: '',
    schema: {
      tags: ['Templates'],
      description: 'Create a new email template',
      body,
      response,
    },
    handler,
  });
};

export default createEmailTemplateRoute;
