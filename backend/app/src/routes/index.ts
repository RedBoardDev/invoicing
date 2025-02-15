import type { FastifyInstance } from 'fastify';

import authRoutes from '@routes/auth';
import healthRoute from '@routes/health';

export async function router(app: FastifyInstance): Promise<void> {
  app.register(healthRoute, { prefix: '/health' });
  app.register(authRoutes, { prefix: '/auth' });
}
