import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { body } from './schemas';

const createEmailTemplateRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'POST',
    url: '',
    schema: {
      tags: ['Templates'],
      description: 'Create a new email template',
      body,
    },
    handler,
  });
};

export default createEmailTemplateRoute;
