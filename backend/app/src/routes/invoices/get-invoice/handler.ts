import { HttpStatusCode } from '@enums/http-status-enums';
import { parseIncludeParams } from '@libs/parseQuery';
import { getInvoiceById } from '@repositories/invoice-repository';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { type TParams, type TQuerystring, includeConfigs } from './schemas';

const handler = async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const { id } = req.params as TParams;
  const includes = parseIncludeParams(req.query as TQuerystring, includeConfigs);

  const invoice = await getInvoiceById(id, includes);

  res.status(HttpStatusCode.ok).send(invoice);
};

export default handler;
