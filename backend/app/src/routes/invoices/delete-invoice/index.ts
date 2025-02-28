import type { FastifyInstance } from 'fastify';
import handler from './handler';
import { body } from './schemas';

const deleteInvoiceRoute = async (app: FastifyInstance): Promise<void> => {
  app.route({
    method: 'DELETE',
    url: '',
    schema: {
      tags: ['Invoices'],
      description: 'Delete one or multiple invoices by IDs',
      body,
    },
    handler,
  });
};

export default deleteInvoiceRoute;
