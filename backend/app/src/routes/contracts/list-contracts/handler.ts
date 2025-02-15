import { HttpStatusCode } from '@enums/http-status-enums';
import { parsePaginationParams } from '@libs/pagination';
import { parseIncludeParams } from '@libs/parseQuery';
import { countContracts, listContracts } from '@repositories/contract-repository';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { type TQuerystring, includeConfigs } from './schemas';

const handler = async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const { pagination, includeTotalCount } = parsePaginationParams(req);
  const includes = parseIncludeParams(req.query as TQuerystring, includeConfigs);

  const contracts = await listContracts(pagination, includes);

  if (includeTotalCount) {
    const totalCount = await countContracts();
    return res.success(HttpStatusCode.ok, contracts, { totalCount, pagination });
  }

  return res.success(HttpStatusCode.ok, contracts, { pagination });
};

export default handler;
