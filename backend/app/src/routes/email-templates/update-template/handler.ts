import { HttpStatusCode } from '@enums/http-status-enums';
import { updateEmailTemplate } from '@repositories/email-template-repository';
import { handleVariablesError } from '@services/email/validate-variables';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { TBody, TParams } from './schemas';

const handler = async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const { id } = req.params as TParams;
  const body = req.body as TBody;

  handleVariablesError(body.subject, body.content);

  const template = await updateEmailTemplate(id, body);

  res.status(HttpStatusCode.ok).send(template);
};

export default handler;
