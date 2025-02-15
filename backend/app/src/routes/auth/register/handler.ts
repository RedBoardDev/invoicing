import { HttpStatusCode } from '@enums/http-status-enums';
import { createUser } from '@repositories/user-repository';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { TBody } from './schemas';

const registerHandler = async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const { email, password } = req.body as TBody;

  const user = await createUser({ email, password });

  res.status(HttpStatusCode.created).send({
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
  });
};

export default registerHandler;
