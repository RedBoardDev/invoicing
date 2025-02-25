import { ErrorsEnum } from '@enums/errors-enums';
import { HttpStatusCode } from '@enums/http-status-enums';
import ApiError from '@libs/error-management/api-error';
import { countContracts } from '@repositories/contract-repository';
import { deleteEmailTemplates } from '@repositories/email-template-repository';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { TBody } from './schemas';

const errorHandler = async (ids: string[]): Promise<void> => {
  for (const id of ids) {
    const contractCount = await countContracts({ emailTemplateId: id });
    if (contractCount < 1) return;
    throw new ApiError(
      'Des contrats sont associés au template',
      HttpStatusCode.badRequest,
      ErrorsEnum.resourcesStillLinked,
    );
  }
};
const handler = async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const { ids } = req.body as TBody;

  await errorHandler(ids);

  const result = await deleteEmailTemplates(ids);

  res.status(HttpStatusCode.ok).send({
    successCount: result.deletedIds.length,
    deletedIds: result.deletedIds,
    failedIds: result.failedIds,
  });
};

export default handler;
