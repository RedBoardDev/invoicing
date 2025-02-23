import { HttpStatusCode } from '@enums/http-status-enums';
import { parsePaginationParams } from '@libs/pagination';
import { parseIncludeParams } from '@libs/parseQuery';
import { countContractHistory, listContractHistory } from '@repositories/contract-repository';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { type TParams, type TQuerystring, includeConfigs } from './schemas';

const handler = async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const { contractId } = req.params as TParams;
  const { pagination, includeTotalCount } = parsePaginationParams(req);
  const includes = parseIncludeParams(req.query as TQuerystring, includeConfigs);

  const history = await listContractHistory(pagination, includes, { contractId });

  if (includeTotalCount) {
    const totalCount = await countContractHistory({ contractId });
    return res.success(HttpStatusCode.ok, history, { totalCount, pagination });
  }

  return res.success(HttpStatusCode.ok, history, { pagination });
};

export default handler;
