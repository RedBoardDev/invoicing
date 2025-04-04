import { HttpStatusCode } from '@enums/http-status-enums';
import { parsePaginationParams } from '@libs/pagination';
import { parseExtendsParams } from '@libs/parseQuery';
import { countInvoices, listInvoices } from '@repositories/invoice-repository';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { type TQuerystring, extendsMap } from './schemas';

const handler = async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const { pagination, includeTotalCount } = parsePaginationParams(req);
  const { includes } = parseExtendsParams(req.query as TQuerystring, extendsMap);

  const invoices = await listInvoices(pagination, includes);

  if (includeTotalCount) {
    const totalCount = await countInvoices();
    return res.success(HttpStatusCode.ok, invoices, { totalCount, pagination });
  }

  return res.success(HttpStatusCode.ok, invoices, { pagination });
};

export default handler;
