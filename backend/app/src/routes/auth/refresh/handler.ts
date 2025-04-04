import type { AccessTokenPayload, AuthTokenData, RefreshTokenPayload } from '@entities/token-entities';
import { HttpStatusCode } from '@enums/http-status-enums';
import ApiError from '@libs/error-management/api-error';
import JWTService from '@services/jwt-service';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { TBody } from './schemas';

const jwtService = new JWTService();

const refreshHandler = async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const { refreshToken } = req.body as TBody;
  const { decoded, tokenExpired } = jwtService.verifyToken(refreshToken);

  if (tokenExpired) {
    throw new ApiError('Refresh token expired', HttpStatusCode.unauthorized, 401);
  }
  if (!decoded || typeof decoded !== 'object' || !('userId' in decoded)) {
    throw new ApiError('Invalid refresh token payload', HttpStatusCode.unauthorized, 401);
  }
  const userId = decoded.userId as string;

  const accessPayload: AccessTokenPayload = { userId, email: (decoded as any).email || '' };
  const refreshPayload: RefreshTokenPayload = { userId };
  const newAccessToken = jwtService.signAccessToken(accessPayload);
  const newRefreshToken = jwtService.signRefreshToken(refreshPayload);
  const tokens: AuthTokenData = { accessToken: newAccessToken, refreshToken: newRefreshToken };

  res.success(HttpStatusCode.ok, tokens);
};

export default refreshHandler;
