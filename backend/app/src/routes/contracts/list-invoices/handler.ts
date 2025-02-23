import { HttpStatusCode } from '@enums/http-status-enums';
import { parsePaginationParams } from '@libs/pagination';
import { parseIncludeParams } from '@libs/parseQuery';
import { countInvoices, listInvoices } from '@repositories/invoice-repository';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { type TParams, type TQuerystring, includeConfigs } from './schemas';

const handler = async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const { contractId } = req.params as TParams;
  const { pagination, includeTotalCount } = parsePaginationParams(req);
  const includes = parseIncludeParams(req.query as TQuerystring, includeConfigs);

  const invoices = await listInvoices(pagination, includes, { contractId });

  if (includeTotalCount) {
    const totalCount = await countInvoices({ contractId });
    return res.success(HttpStatusCode.ok, invoices, { totalCount, pagination });
  }

  return res.success(HttpStatusCode.ok, invoices, { pagination });
};

export default handler;
