import { HttpStatusCode } from '@enums/http-status-enums';
import { deleteContract } from '@repositories/contract-repository';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { TParams } from './schemas';

const handler = async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const { id } = req.params as TParams;

  const contract = await deleteContract(id);

  res.status(HttpStatusCode.ok).send(contract);
};

export default handler;
