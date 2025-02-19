import { HttpStatusCode } from '@enums/http-status-enums';
import { createEmailTemplate } from '@repositories/email-template-repository';
import { handleVariablesError } from '@services/email/validate-variables';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { TBody } from './schemas';

const handler = async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const body = req.body as TBody;

  handleVariablesError(body.subject, body.content);

  const template = await createEmailTemplate(body);

  res.status(HttpStatusCode.created).send(template);
};

export default handler;
