import { HttpStatusCode } from '@enums/http-status-enums';
import { parseIncludeParams } from '@libs/parseQuery';
import { getContractById } from '@repositories/contract-repository';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { type TParams, type TQuerystring, includeConfigs } from './schemas';

const handler = async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const { id } = req.params as TParams;
  const includes = parseIncludeParams(req.query as TQuerystring, includeConfigs);

  const contract = await getContractById(id, includes);

  res.status(HttpStatusCode.ok).send(contract);
};

export default handler;
