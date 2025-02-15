import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import ApiError from '@libs/error-management/api-error';
import { Errors, ErrorsEnum } from '@enums/errors-enums';

const sendErrorResponse = (
  res: FastifyReply,
  httpCode: number,
  message: string,
  statusCode: number,
  statusKey: string,
  details: unknown = null,
): void => {
  res.status(httpCode).send({
    status: 'error',
    error: {
      message,
      httpCode,
      statusCode,
      statusKey,
      details,
    },
  });
};

const mapValidationContextToError = (validationContext: string): { statusCode: number; statusKey: string } => {
  switch (validationContext) {
    case 'body':
      return {
        statusCode: ErrorsEnum.invalidBody,
        statusKey: Errors[ErrorsEnum.invalidBody],
      };
    case 'querystring':
      return {
        statusCode: ErrorsEnum.invalidQueryParameter,
        statusKey: Errors[ErrorsEnum.invalidQueryParameter],
      };
    case 'headers':
      return {
        statusCode: ErrorsEnum.invalidHeader,
        statusKey: Errors[ErrorsEnum.invalidHeader],
      };
    default:
      return {
        statusCode: ErrorsEnum.badRequest,
        statusKey: Errors[ErrorsEnum.badRequest],
      };
  }
};

const handleApiError = (error: ApiError, res: FastifyReply): void => {
  sendErrorResponse(res, error.httpCode, error.message, error.statusCode, error.statusKey, error.details);
};

const handleRateLimitError = (res: FastifyReply): void => {
  sendErrorResponse(
    res,
    429,
    'Too many requests, please try again later',
    ErrorsEnum.limitExceeded,
    Errors[ErrorsEnum.limitExceeded],
  );
};

const handleValidationError = (error: FastifyError, res: FastifyReply): void => {
  const { statusCode, statusKey } = mapValidationContextToError(error.validationContext || '');
  sendErrorResponse(
    res,
    error.statusCode || 400,
    error.message || 'Validation error',
    statusCode,
    statusKey,
    error.validation,
  );
};

const handleUnknownError = (error: Error, res: FastifyReply): void => {
  sendErrorResponse(
    res,
    500,
    error.message || 'Internal Server Error',
    ErrorsEnum.internalServerError,
    Errors[ErrorsEnum.internalServerError],
  );
};

const catchFinallyHandler = (error: FastifyError | Error, _request: FastifyRequest, res: FastifyReply): void => {
  if (error instanceof ApiError) {
    handleApiError(error, res);
  } else if ('code' in error && error.code === 'FST_ERR_RATE_LIMIT') {
    handleRateLimitError(res);
  } else if ('code' in error && error.code === 'FST_ERR_VALIDATION') {
    handleValidationError(error, res);
  } else {
    handleUnknownError(error, res);
  }
};

export default catchFinallyHandler;
