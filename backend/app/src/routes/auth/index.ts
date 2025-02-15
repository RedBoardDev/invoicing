import loginRoute from '@routes/auth/login';
import refreshRoute from '@routes/auth/refresh';
import registerRoute from '@routes/auth/register';
import type { FastifyInstance } from 'fastify';

const authRoutes = async (app: FastifyInstance): Promise<void> => {
  app.register(registerRoute);
  app.register(loginRoute);
  app.register(refreshRoute);
};

export default authRoutes;
