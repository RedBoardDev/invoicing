import { HttpStatusCode } from '@enums/http-status-enums';
import { parseExtendsParams } from '@libs/parseQuery';
import { computePermissions } from '@libs/permissions';
import { contractPermissionConditions } from '@libs/permissions/entities/contract';
import { getContractById } from '@repositories/contract-repository';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { type TParams, type TQuerystring, extendsMap } from './schemas';

const handler = async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const { id } = req.params as TParams;
  const { includes, computed } = parseExtendsParams(req.query as TQuerystring, extendsMap);

  const contract = await getContractById(id, includes);

  if (computed.includes('permissions')) {
    const permissions = await computePermissions(contract, contractPermissionConditions);
    return res.status(HttpStatusCode.ok).send({
      contract,
      ...permissions,
    });
  }

  res.status(HttpStatusCode.ok).send(contract);
};

export default handler;
