import { ErrorsEnum } from '@enums/errors-enums';
import { HttpStatusCode } from '@enums/http-status-enums';
import ApiError from '@libs/error-management/api-error';
import { deleteContracts } from '@repositories/contract-repository';
import { countInvoices } from '@repositories/invoice-repository';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { TBody } from './schemas';

const errorHandler = async (ids: string[]): Promise<void> => {
  for (const id of ids) {
    const invoiceCount = await countInvoices({ contractId: id });
    if (invoiceCount > 0) {
      throw new ApiError(
        'Des factures sont associées au contrat',
        HttpStatusCode.badRequest,
        ErrorsEnum.resourcesStillLinked,
      );
    }
  }
};

const handler = async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const { ids } = req.body as TBody;

  await errorHandler(ids);

  const result = await deleteContracts(ids);

  res.status(HttpStatusCode.ok).send({
    successCount: result.deletedIds.length,
    deletedIds: result.deletedIds,
    failedIds: result.failedIds,
  });
};

export default handler;
