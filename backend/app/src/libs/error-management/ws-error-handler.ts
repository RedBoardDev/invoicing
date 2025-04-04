import ApiError from '@libs/error-management/api-error';
import type { ErrorObject } from 'entities/errors';

export const wsErrorHandler = (error: ErrorObject): { error: ErrorObject } => {
  if (error instanceof ApiError) {
    console.error(error);
    return {
      error: {
        message: error.message,
        httpCode: error.httpCode,
        statusCode: error.statusCode,
        statusKey: error.statusKey,
      },
    };
  }
  console.error(error);
  return {
    error: {
      message: error.message,
      httpCode: 500,
      statusCode: 5000,
      statusKey: 'internalServerError',
    },
  };
};
