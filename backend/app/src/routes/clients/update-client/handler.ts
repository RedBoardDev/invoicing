import { HttpStatusCode } from '@enums/http-status-enums';
import { updateClient } from '@repositories/client-repository';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { TBody, TParams } from './schemas';

const handler = async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const { id } = req.params as TParams;
  const data = req.body as TBody;

  const client = await updateClient(id, data);

  res.status(HttpStatusCode.ok).send(client);
};

export default handler;
