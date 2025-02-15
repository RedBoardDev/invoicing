import { HttpStatusCode } from '@enums/http-status-enums';
import type { FastifyReply, FastifyRequest } from 'fastify';

const handler = async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  res.status(HttpStatusCode.ok).send('test');
};

export default handler;
