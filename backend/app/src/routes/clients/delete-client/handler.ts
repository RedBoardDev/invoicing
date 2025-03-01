import { ErrorsEnum } from '@enums/errors-enums';
import { HttpStatusCode } from '@enums/http-status-enums';
import ApiError from '@libs/error-management/api-error';
import { deleteClients } from '@repositories/client-repository';
import { countContracts } from '@repositories/contract-repository';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { TBody } from './schemas';

const errorHandler = async (ids: string[]): Promise<void> => {
  for (const id of ids) {
    const contractCount = await countContracts({ clientId: id });
    if (contractCount > 0) {
      throw new ApiError(
        'Des contrats sont associés au client',
        HttpStatusCode.badRequest,
        ErrorsEnum.resourcesStillLinked,
      );
    }
  }
};

const handler = async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const { ids } = req.body as TBody;

  await errorHandler(ids);

  const result = await deleteClients(ids);

  res.success(HttpStatusCode.ok, {
    successCount: result.deletedIds.length,
    deletedIds: result.deletedIds,
    failedIds: result.failedIds,
  });
};

export default handler;
