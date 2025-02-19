import { HttpStatusCode } from '@enums/http-status-enums';
import { deleteEmailTemplates } from '@repositories/email-template-repository';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { TBody } from './schemas';

const handler = async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const { ids } = req.body as TBody;

  const result = await deleteEmailTemplates(ids);

  res.status(HttpStatusCode.ok).send({
    successCount: result.deletedIds.length,
    deletedIds: result.deletedIds,
    failedIds: result.failedIds,
  });
};

export default handler;
