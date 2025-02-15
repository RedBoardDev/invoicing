import { HttpStatusCode } from '@enums/http-status-enums';
import { parsePaginationParams } from '@libs/pagination';
import { parseIncludeParams } from '@libs/parseQuery';
import { countClients, listClients } from '@repositories/client-repository';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { type TQuerystring, includeConfigs } from './schemas';

const handler = async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const { pagination, includeTotalCount } = parsePaginationParams(req);
  const includes = parseIncludeParams(req.query as TQuerystring, includeConfigs);

  const clients = await listClients(pagination, includes);

  if (includeTotalCount) {
    const totalCount = await countClients();
    return res.success(HttpStatusCode.ok, clients, { totalCount, pagination });
  }

  return res.success(HttpStatusCode.ok, clients, { pagination });
};

export default handler;
