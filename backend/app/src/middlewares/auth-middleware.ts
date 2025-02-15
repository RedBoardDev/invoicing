import { FastifyReply, FastifyRequest } from 'fastify';
import JWTService from '@services/jwt-service';
import ApiError from '@libs/error-management/api-error';
import { ErrorsEnum } from '@enums/errors-enums';

const jwtService = new JWTService();

export const authMiddleware = async (request: FastifyRequest, _reply: FastifyReply): Promise<void> => {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError('Authorization token is missing or malformed', 401, ErrorsEnum.unauthorized);
  }

  const token = authHeader.split(' ')[1];
  const { decoded, tokenExpired } = jwtService.verifyToken(token);

  if (tokenExpired) {
    throw new ApiError('Token expired', 401, ErrorsEnum.unauthorized);
  }

  // eslint-disable-next-line no-param-reassign
  request.user = decoded;
};
