import { HttpStatusCode } from '@enums/http-status-enums';
import { parsePaginationParams } from '@libs/pagination';
import { countEmailTemplates, listEmailTemplates } from '@repositories/email-template-repository';
import type { FastifyReply, FastifyRequest } from 'fastify';

const handler = async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const { pagination, includeTotalCount } = parsePaginationParams(req);

  const emailTemplates = await listEmailTemplates(pagination);

  if (includeTotalCount) {
    const totalCount = await countEmailTemplates();
    return res.success(HttpStatusCode.ok, emailTemplates, { totalCount, pagination });
  }

  return res.success(HttpStatusCode.ok, emailTemplates, { pagination });
};

export default handler;
