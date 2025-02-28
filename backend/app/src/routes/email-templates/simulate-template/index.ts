import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { params } from './schemas';

const simulateTemplateRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'GET',
    url: '/:id/simulate/:invoiceId',
    schema: {
      tags: ['Templates'],
      description: 'Simumate an email template by id for an invoice',
      params,
    },
    handler,
  });
};

export default simulateTemplateRoute;
