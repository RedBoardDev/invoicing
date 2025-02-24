import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { response } from './schemas';

const previewInvoiceNumberRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'GET',
    url: '/preview-number',
    schema: {
      tags: ['Invoices'],
      description: 'Preview the next invoice number without incrementing the sequence',
      response,
    },
    handler,
  });
};

export default previewInvoiceNumberRoute;
