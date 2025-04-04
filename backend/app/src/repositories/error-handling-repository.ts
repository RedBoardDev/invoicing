import { ErrorsEnum } from '@enums/errors-enums';
/* eslint-disable @typescript-eslint/no-explicit-any */
import ApiError from '@libs/error-management/api-error';

const getErrorWithCode = (errorCode: string): void => {
  const errors: Record<string, { message: string; statusCode: number; errorEnum: ErrorsEnum }> = {
    P2000: { message: 'Value too long for column', statusCode: 400, errorEnum: ErrorsEnum.invalidBody },
    P2001: { message: 'Where condition invalid', statusCode: 400, errorEnum: ErrorsEnum.invalidBody },
    P2002: {
      message: 'A constraint failed on the database',
      statusCode: 400,
      errorEnum: ErrorsEnum.ressourceAlreadyExists,
    },
    P2003: { message: 'Foreign key constraint failed', statusCode: 400, errorEnum: ErrorsEnum.invalidBody },
    P2005: { message: 'Invalid value type', statusCode: 400, errorEnum: ErrorsEnum.invalidBody },
    P2006: { message: 'Invalid value type', statusCode: 400, errorEnum: ErrorsEnum.invalidBody },
    P2012: { message: 'Missing required value', statusCode: 400, errorEnum: ErrorsEnum.invalidBody },
    P2013: { message: 'Missing required argument', statusCode: 400, errorEnum: ErrorsEnum.invalidBody },
    P2015: { message: 'Value cannot be found', statusCode: 404, errorEnum: ErrorsEnum.ressourceNotFound },
    P2017: { message: 'Relation not connected', statusCode: 400, errorEnum: ErrorsEnum.invalidBody },
    P2019: { message: 'Input Error', statusCode: 400, errorEnum: ErrorsEnum.invalidBody },
    P2020: { message: 'Value out of range', statusCode: 400, errorEnum: ErrorsEnum.invalidBody },
    P2021: { message: 'Table not found', statusCode: 400, errorEnum: ErrorsEnum.invalidBody },
    P2022: { message: 'Column not found', statusCode: 400, errorEnum: ErrorsEnum.invalidBody },
    P2025: { message: 'Not found', statusCode: 404, errorEnum: ErrorsEnum.ressourceNotFound },
  };

  throw new ApiError(errors[errorCode].message, errors[errorCode].statusCode, errors[errorCode].errorEnum);
};

/**
 * Wraps an asynchronous function to handle errors consistently.
 *
 * This higher-order function takes an async function `fn` and returns a new function that wraps `fn`.
 * When the returned function is called, it executes `fn` and catches any errors that occur:
 * - If the error is an instance of `ApiError`, it rethrows it.
 * - If the error has a `code` property (e.g., a Prisma error code), it throws an `ApiError` based on that code.
 * - Otherwise, it throws a generic `ApiError` with a 500 HTTP status code.
 *
 * @typeParam T - The type of the asynchronous function to wrap.
 * @param fn - The asynchronous function to wrap.
 * @returns A new function that wraps `fn` and handles errors.
 */
export const handleError =
  <T extends (...args: any[]) => Promise<any>>(fn: T): ((...args: Parameters<T>) => Promise<ReturnType<T>>) =>
  async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    try {
      return (await fn(...args)) as ReturnType<T>;
    } catch (error) {
      console.error(error);

      if (error instanceof ApiError) throw error;

      const typedError = error as { code?: string };
      if (typedError.code) getErrorWithCode(typedError.code);

      throw new ApiError('An error occurred while processing the request', 500, ErrorsEnum.internalServerError);
    }
  };
