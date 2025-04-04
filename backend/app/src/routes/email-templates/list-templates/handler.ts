import { HttpStatusCode } from '@enums/http-status-enums';
import { parsePaginationParams } from '@libs/pagination';
import { parseExtendsParams } from '@libs/parseQuery';
import { computePermissions } from '@libs/permissions';
import { emailTemplatePermissionConditions } from '@libs/permissions/entities/emailTemplate';
import { countEmailTemplates, listEmailTemplates } from '@repositories/email-template-repository';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { type TQuerystring, extendsMap } from './schemas';

const handler = async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const { pagination, includeTotalCount } = parsePaginationParams(req);
  const { includes, computed } = parseExtendsParams(req.query as TQuerystring, extendsMap);

  const emailTemplates = await listEmailTemplates(pagination, includes);

  if (computed.includes('permissions')) {
    const templatesWithPermissions = await Promise.all(
      emailTemplates.map(async (template) => {
        const permissions = await computePermissions(template, emailTemplatePermissionConditions);
        return { ...template, permissions };
      }),
    );

    if (includeTotalCount) {
      const totalCount = await countEmailTemplates();
      return res.success(HttpStatusCode.ok, templatesWithPermissions, { totalCount, pagination });
    }

    return res.success(HttpStatusCode.ok, templatesWithPermissions, { pagination });
  }

  if (includeTotalCount) {
    const totalCount = await countEmailTemplates();
    return res.success(HttpStatusCode.ok, emailTemplates, { totalCount, pagination });
  }

  return res.success(HttpStatusCode.ok, emailTemplates, { pagination });
};

export default handler;
