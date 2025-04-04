import type { FastifyInstance } from 'fastify';
import handler from './handler';

const previewInvoiceNumberRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'GET',
    url: '/preview-number',
    schema: {
      tags: ['Invoices'],
      description: 'Preview the next invoice number without incrementing the sequence',
    },
    handler,
  });
};

export default previewInvoiceNumberRoute;
