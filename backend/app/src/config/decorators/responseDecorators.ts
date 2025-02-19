import { ErrorsEnum } from '@enums/errors-enums';
import { HttpStatusCode } from '@enums/http-status-enums';
import ApiError from '@libs/error-management/api-error';
import type { FastifyReply } from 'fastify';

/**
 * Envoie une réponse de succès avec le code HTTP spécifié.
 *
 * @param this - L'instance FastifyReply.
 * @param statusCode - Le code HTTP de la réponse.
 * @param data - Les données à envoyer dans la réponse.
 * @param meta - Les métadonnées optionnelles pour la réponse.
 */
export function success<T>(
  this: FastifyReply,
  statusCode: HttpStatusCode,
  data: T,
  meta?: Record<string, unknown>,
): void {
  this.code(statusCode).send({
    status: 'success',
    data,
    ...(meta && { meta }),
  });
}

/**
 * Lève une erreur API avec le code HTTP spécifié.
 *
 * @param this - L'instance FastifyReply.
 * @param message - Le message d'erreur descriptif.
 * @param httpCode - Le code HTTP à retourner.
 * @param statusCode - Le code de statut spécifique à l'application.
 * @param details - Détails supplémentaires sur l'erreur.
 */
export function error(
  this: FastifyReply,
  message: string,
  httpCode: HttpStatusCode = HttpStatusCode.badRequest,
  statusCode: ErrorsEnum = ErrorsEnum.badRequest,
  details?: Record<string, unknown>,
): never {
  const errorInstance = new ApiError(message, httpCode, statusCode, details);
  this.code(httpCode);
  throw errorInstance;
}
