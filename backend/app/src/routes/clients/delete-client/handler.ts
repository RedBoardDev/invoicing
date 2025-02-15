import { HttpStatusCode } from '@enums/http-status-enums';
import { deleteClient } from '@repositories/client-repository';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { TParams } from './schemas';

const handler = async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const { id } = req.params as TParams;

  const client = await deleteClient(id);

  res.status(HttpStatusCode.ok).send(client);
};

export default handler;
