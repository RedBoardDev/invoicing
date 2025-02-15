import type { AccessTokenPayload, AuthTokenData, RefreshTokenPayload } from '@entities/token-entities';
import { HttpStatusCode } from '@enums/http-status-enums';
import ApiError from '@libs/error-management/api-error';
import { verifyPassword } from '@libs/password';
import { getUserByEmail } from '@repositories/user-repository';
import JWTService from '@services/jwt-service';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { TBody } from './schemas';

const jwtService = new JWTService();

const loginHandler = async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
  const { email, password } = req.body as TBody;
  const user = await getUserByEmail(email);
  if (!user) {
    throw new ApiError('Invalid credentials', HttpStatusCode.unauthorized, 401);
  }
  const valid = await verifyPassword(password, user.hashedPassword);
  if (!valid) {
    throw new ApiError('Invalid credentials', HttpStatusCode.unauthorized, 401);
  }

  const accessPayload: AccessTokenPayload = { userId: user.id, email: user.email };
  const refreshPayload: RefreshTokenPayload = { userId: user.id };

  const accessToken = jwtService.signAccessToken(accessPayload);
  const refreshToken = jwtService.signRefreshToken(refreshPayload);

  const tokens: AuthTokenData = { accessToken, refreshToken };
  res.status(HttpStatusCode.ok).send(tokens);
};

export default loginHandler;
