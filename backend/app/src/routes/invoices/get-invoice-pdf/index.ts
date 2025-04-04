import type { FastifyInstance } from 'fastify';
import { handler } from './handler';
import { params } from './schemas';

const getInvoicePdfRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'GET',
    url: '/:id/pdf',
    schema: {
      tags: ['Invoices'],
      description: 'View the PDF of an invoice (generated on demand for DRAFT, served from S3 for VALIDATED)',
      params,
    },
    handler,
  });
};

export default getInvoicePdfRoute;
