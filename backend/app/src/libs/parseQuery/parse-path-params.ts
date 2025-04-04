import { ErrorsEnum } from '@enums/errors-enums';
import ApiError from '@libs/error-management/api-error';
import type { FastifyRequest } from 'fastify';

export const parsePathParamNumber = (req: FastifyRequest, key: string): number => {
  const pathParams = req.params as Record<string, string>;
  const value = Number.parseInt(pathParams[key], 10);

  if (Number.isNaN(value)) {
    throw new ApiError(`Invalid path parameter: ${key}`, 400, ErrorsEnum.invalidPathParameter);
  }

  return value;
};

export const parsePathParamString = (req: FastifyRequest, key: string): string => {
  const pathParams = req.params as Record<string, string>;
  const paramValue = pathParams[key];

  if (!Object.prototype.hasOwnProperty.call(pathParams, key) || paramValue == null || paramValue.trim() === '') {
    throw new ApiError(`Missing or empty path parameter: ${key}`, 400, ErrorsEnum.invalidPathParameter);
  }

  return paramValue;
};
