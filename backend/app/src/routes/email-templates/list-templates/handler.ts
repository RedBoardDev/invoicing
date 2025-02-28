import { HttpStatusCode } from '@enums/http-status-enums';
import { parsePaginationParams } from '@libs/pagination';
import { parseExtendsParams } from '@libs/parseQuery';
import { countEmailTemplates, listEmailTemplates } from '@repositories/email-template-repository';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { type TQuerystring, extendsMap } from './schemas';

const handler = async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const { pagination, includeTotalCount } = parsePaginationParams(req);
  const { includes } = parseExtendsParams(req.query as TQuerystring, extendsMap);

  const emailTemplates = await listEmailTemplates(pagination, includes);

  if (includeTotalCount) {
    const totalCount = await countEmailTemplates();
    return res.success(HttpStatusCode.ok, emailTemplates, { totalCount, pagination });
  }

  return res.success(HttpStatusCode.ok, emailTemplates, { pagination });
};

export default handler;
