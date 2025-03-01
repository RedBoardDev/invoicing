import { checkDatabaseConnection } from '@repositories/health-repository';
import type { FastifyReply, FastifyRequest } from 'fastify';

const handler = async (_req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const isDatabaseConnected = await checkDatabaseConnection();

  const status = isDatabaseConnected ? 'healthy' : 'degraded';

  return res.success(isDatabaseConnected ? 200 : 503, {
    status,
    message: isDatabaseConnected ? 'Service is operational' : 'Service is experiencing issues',
  });
};

export default handler;
