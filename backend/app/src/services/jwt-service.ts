import type { AccessTokenPayload, RefreshTokenPayload } from '@entities/token-entities';
import { ErrorsEnum } from '@enums/errors-enums';
import ApiError from '@libs/error-management/api-error';
import jwt, { type JwtPayload, TokenExpiredError, type SignOptions } from 'jsonwebtoken';

export default class JWTService {
  private secretKey: string;

  constructor() {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new ApiError('JWT_SECRET is not defined in the environment variables', 500, ErrorsEnum.internalServerError);
    }
    this.secretKey = jwtSecret;
  }

  signAccessToken = (payload: AccessTokenPayload, expiresIn: SignOptions['expiresIn'] = '15m'): string => {
    try {
      return jwt.sign(payload, this.secretKey, { expiresIn });
    } catch (error) {
      console.error('Error signing access token:', error);
      throw new ApiError('Error when signing the access token', 500, ErrorsEnum.internalServerError);
    }
  };

  signRefreshToken = (payload: RefreshTokenPayload, expiresIn: SignOptions['expiresIn'] = '1d'): string => {
    try {
      return jwt.sign(payload, this.secretKey, { expiresIn });
    } catch (error) {
      console.error('Error signing refresh token:', error);
      throw new ApiError('Error when signing the refresh token', 500, ErrorsEnum.internalServerError);
    }
  };

  verifyToken = (token: string): { decoded: JwtPayload | string; tokenExpired: boolean } => {
    let decoded: JwtPayload | string = '';
    let tokenExpired = false;
    try {
      decoded = jwt.verify(token, this.secretKey);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        tokenExpired = true;
      } else {
        console.error('Error verifying token:', error);
        throw new ApiError('Invalid token', 400, ErrorsEnum.invalidToken);
      }
    }
    return { decoded, tokenExpired };
  };
}
