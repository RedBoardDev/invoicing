import { HttpStatusCode } from '@enums/http-status-enums';
import { parseExtendsParams } from '@libs/parseQuery';
import { computePermissions } from '@libs/permissions';
import { invoicePermissionConditions } from '@libs/permissions/entities/invoice';
import { getInvoiceById } from '@repositories/invoice-repository';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { type TParams, type TQuerystring, extendsMap } from './schemas';

const handler = async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const { id } = req.params as TParams;
  const { includes, computed } = parseExtendsParams(req.query as TQuerystring, extendsMap);

  const invoice = await getInvoiceById(id, includes);

  if (computed.includes('permissions')) {
    const permissions = await computePermissions(invoice, invoicePermissionConditions);
    return res.success(HttpStatusCode.ok, { invoice }, { ...permissions });
  }

  res.success(HttpStatusCode.ok, invoice);
};

export default handler;
