import { HttpStatusCode } from '@enums/http-status-enums';
import { parseExtendsParams } from '@libs/parseQuery';
import { computePermissions } from '@libs/permissions';
import { emailTemplatePermissionConditions } from '@libs/permissions/entities/emailTemplate';
import { getEmailTemplateById } from '@repositories/email-template-repository';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { TParams } from './schemas';
import { type TQuerystring, extendsMap } from './schemas';

const handler = async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const { id } = req.params as TParams;
  const { computed } = parseExtendsParams(req.query as TQuerystring, extendsMap);

  const template = await getEmailTemplateById(id);

  if (computed.includes('permissions')) {
    const permissions = await computePermissions(template, emailTemplatePermissionConditions);
    return res.success(HttpStatusCode.ok, { template }, { ...permissions });
  }

  res.success(HttpStatusCode.ok, template);
};

export default handler;
