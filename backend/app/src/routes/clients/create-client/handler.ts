import { HttpStatusCode } from '@enums/http-status-enums';
import { createClient } from '@repositories/client-repository';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { TBody } from './schemas';

const handler = async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const body = req.body as TBody;

  const client = await createClient(body);

  res.status(HttpStatusCode.created).send(client);
};

export default handler;
