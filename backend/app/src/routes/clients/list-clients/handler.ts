import { HttpStatusCode } from '@enums/http-status-enums';
import { parsePaginationParams } from '@libs/pagination';
import { countClients, listClients } from '@repositories/client-repository';
import type { FastifyReply, FastifyRequest } from 'fastify';

const handler = async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const { pagination, includeTotalCount } = parsePaginationParams(req);

  const clients = await listClients(pagination);

  if (includeTotalCount) {
    const totalCount = await countClients();
    return res.success(HttpStatusCode.ok, clients, { totalCount, pagination });
  }

  return res.success(HttpStatusCode.ok, clients, { pagination });
};

export default handler;
