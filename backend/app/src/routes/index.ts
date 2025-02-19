import type { FastifyInstance } from 'fastify';

import authRoutes from '@routes/auth';
import clientsRoutes from '@routes/clients';
import contractsRoutes from '@routes/contracts';
import templatesRoutes from '@routes/email-templates';
import healthRoute from '@routes/health';
import invoicesRoutes from '@routes/invoices';

export async function router(app: FastifyInstance): Promise<void> {
  app.register(healthRoute, { prefix: '/health' });
  app.register(authRoutes, { prefix: '/auth' });
  app.register(clientsRoutes, { prefix: '/clients' });
  app.register(contractsRoutes, { prefix: '/contracts' });
  app.register(invoicesRoutes, { prefix: '/invoices' });
  app.register(templatesRoutes, { prefix: '/email-templates' });
}
