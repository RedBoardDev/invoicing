import 'fastify';
import { JwtPayload } from 'jsonwebtoken';
import { HttpStatusCode } from '@enums/http-status-enums';
import { ErrorsEnum } from '@enums/errors-enums';

declare module 'fastify' {
  interface FastifyRequest {
    user?: string | JwtPayload;
  }

  interface FastifyReply {
    /**
     * Sends a success response with the specified HTTP code.
     *
     * @param statusCode - The HTTP code of the response.
     * @param data - The data to send in the response.
     * @param meta - Optional metadata for the response.
     */
    success<T>(statusCode: HttpStatusCode, data: T, meta?: Record<string, unknown>): void;

    /**
     * Throws an API error with the specified HTTP code.
     *
     * @param message - The descriptive error message.
     * @param httpCode - The HTTP code to return.
     * @param statusCode - The application-specific status code.
     * @param details - Additional details about the error.
     */
    error(
      message: string,
      httpCode?: HttpStatusCode,
      statusCode?: ErrorsEnum,
      details?: Record<string, unknown>,
    ): never;
  }
}
