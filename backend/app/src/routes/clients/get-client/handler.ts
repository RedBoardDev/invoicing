import { HttpStatusCode } from '@enums/http-status-enums';
import { parseIncludeParams } from '@libs/parseQuery';
import { getClientById } from '@repositories/client-repository';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { TParams } from './schemas';
import { type TQuerystring, includeConfigs } from './schemas';

const handler = async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const { id } = req.params as TParams;
  const includes = parseIncludeParams(req.query as TQuerystring, includeConfigs);

  const client = await getClientById(id, includes);

  res.status(HttpStatusCode.ok).send(client);
};

export default handler;
