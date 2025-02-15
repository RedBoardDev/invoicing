import { ErrorsEnum } from '@enums/errors-enums';
import { HttpStatusCode } from '@enums/http-status-enums';
import ApiError from '@libs/error-management/api-error';
import { createUser, getUserByEmail } from '@repositories/user-repository';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { TBody } from './schemas';

const registerHandler = async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const { email, password } = req.body as TBody;

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new ApiError('User already exists', HttpStatusCode.conflict, ErrorsEnum.ressourceAlreadyExists);
  }

  const user = await createUser({ email, password });

  res.status(HttpStatusCode.created).send({
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
  });
};

export default registerHandler;
