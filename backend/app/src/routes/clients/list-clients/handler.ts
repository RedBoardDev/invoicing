import { HttpStatusCode } from '@enums/http-status-enums';
import { parsePaginationParams } from '@libs/pagination';
import { parseExtendsParams } from '@libs/parseQuery';
import { countClients, listClients } from '@repositories/client-repository';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { type TQuerystring, extendsMap } from './schemas';

const handler = async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const { pagination, includeTotalCount } = parsePaginationParams(req);
  const { includes } = parseExtendsParams(req.query as TQuerystring, extendsMap);

  const clients = await listClients(pagination, includes);

  if (includeTotalCount) {
    const totalCount = await countClients();
    return res.success(HttpStatusCode.ok, clients, { totalCount, pagination });
  }

  res.success(HttpStatusCode.ok, clients, { pagination });
};

export default handler;
