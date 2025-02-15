import jwt, { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import ApiError from '@libs/error-management/api-error';
import { ErrorsEnum } from '@enums/errors-enums';

export default class JWTService {
  private secretKey: string;

  constructor() {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new ApiError('JWT_SECRET is not defined in the environment variables', 500, ErrorsEnum.internalServerError);
    }
    this.secretKey = jwtSecret;
  }

  signToken = (payload: object, expiresIn: string = '72h'): string => {
    try {
      const token = jwt.sign(payload, this.secretKey, { expiresIn });
      return token;
    } catch (error) {
      console.error('Error signing the token:', error);
      throw new ApiError('Error when signing the token', 500, ErrorsEnum.internalServerError);
    }
  };

  signTokenNoExpiration = (payload: object): string => {
    try {
      const token = jwt.sign(payload, this.secretKey);
      return token;
    } catch (error) {
      console.error('Error signing the token:', error);
      throw new ApiError('Error when signing the token', 500, ErrorsEnum.internalServerError);
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
        console.error('Error verifying the token:', error);
        throw new ApiError('Invalid token', 400, ErrorsEnum.invalidToken);
      }
    }

    return { decoded, tokenExpired };
  };
}
