import { HttpStatusCode } from '@enums/http-status-enums';
import { parsePaginationParams } from '@libs/pagination';
import { parseExtendsParams } from '@libs/parseQuery';
import { countContracts, listContracts } from '@repositories/contract-repository';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { type TParams, type TQuerystring, extendsMap } from './schemas';

const handler = async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const { clientId } = req.params as TParams;
  const { pagination, includeTotalCount } = parsePaginationParams(req);
  const { includes } = parseExtendsParams(req.query as TQuerystring, extendsMap);

  const contracts = await listContracts(pagination, includes, { clientId });

  if (includeTotalCount) {
    const totalCount = await countContracts({ clientId });
    return res.success(HttpStatusCode.ok, contracts, { totalCount, pagination });
  }

  return res.success(HttpStatusCode.ok, contracts, { pagination });
};

export default handler;
