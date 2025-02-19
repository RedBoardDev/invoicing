import { HttpStatusCode } from '@enums/http-status-enums';
import { getEmailTemplateById } from '@repositories/email-template-repository';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { TParams } from './schemas';

const handler = async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const { id } = req.params as TParams;

  const template = await getEmailTemplateById(id);

  res.status(HttpStatusCode.ok).send(template);
};

export default handler;
