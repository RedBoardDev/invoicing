import { HttpStatusCode } from '@enums/http-status-enums';
import { parseExtendsParams } from '@libs/parseQuery';
import { computePermissions } from '@libs/permissions';
import { clientPermissionConditions } from '@libs/permissions/entities/client';
import { getClientById } from '@repositories/client-repository';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { TParams } from './schemas';
import { type TQuerystring, extendsMap } from './schemas';

const handler = async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const { id } = req.params as TParams;
  const { includes, computed } = parseExtendsParams(req.query as TQuerystring, extendsMap);

  const client = await getClientById(id, includes);

  if (computed.includes('permissions')) {
    const permissions = await computePermissions(client, clientPermissionConditions);
    return res.success(HttpStatusCode.ok, client, { permissions });
  }

  res.success(HttpStatusCode.ok, client);
};

export default handler;
