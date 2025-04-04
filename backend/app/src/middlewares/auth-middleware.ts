import { ErrorsEnum } from '@enums/errors-enums';
import ApiError from '@libs/error-management/api-error';
import { getUserById } from '@repositories/user-repository';
import JWTService from '@services/jwt-service';
import type { FastifyReply, FastifyRequest } from 'fastify';

const jwtService = new JWTService();

export const authMiddleware = async (req: FastifyRequest, _res: FastifyReply): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError('Authorization token is missing or malformed', 401, ErrorsEnum.unauthorized);
    }

    const token = authHeader.split(' ')[1];
    const { decoded, tokenExpired } = jwtService.verifyToken(token);

    if (tokenExpired) {
      throw new ApiError('Token expired', 401, ErrorsEnum.unauthorized);
    }

    if (!decoded || typeof decoded !== 'object' || !('userId' in decoded)) {
      throw new ApiError('Invalid token payload', 401, ErrorsEnum.unauthorized);
    }

    const userId = decoded.userId as string;
    const user = await getUserById(userId);
    if (!user) {
      throw new ApiError('User not found', 401, ErrorsEnum.unauthorized);
    }

    req.user = decoded;
  } catch (error) {
    throw new ApiError('Authentication failed', 401, ErrorsEnum.unauthorized);
  }
};
