import { FastifyReply, FastifyRequest } from 'fastify';
import { checkDatabaseConnection } from '@repositories/health-repository';

const Handler = async (_req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const isDatabaseConnected = await checkDatabaseConnection();

  const status = isDatabaseConnected ? 'healthy' : 'degraded';

  return res.status(isDatabaseConnected ? 200 : 503).send({
    status,
    message: isDatabaseConnected ? 'Service is operational' : 'Service is experiencing issues',
  });
};

export default Handler;
