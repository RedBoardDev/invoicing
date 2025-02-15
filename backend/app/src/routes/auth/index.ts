import type { FastifyInstance } from 'fastify';
import loginRoute from './login';
import refreshRoute from './refresh';

const authRoutes = async (app: FastifyInstance): Promise<void> => {
  app.register(loginRoute);
  app.register(refreshRoute);
};

export default authRoutes;
