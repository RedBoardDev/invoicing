import { HttpStatusCode } from '@enums/http-status-enums';
import { Errors, ErrorsEnum } from '@enums/errors-enums';

class ApiError extends Error {
  public statusCode: number;

  public httpCode: number;

  public statusKey: string;

  public details?: unknown;

  /**
   * Constructs a new `ApiError` instance.
   *
   * @param message - A descriptive error message
   * @param httpCode - An HTTP status code (default: `HttpStatusCode.badRequest`).
   * @param statusCode - An application-specific status code (default: `ErrorsEnum.badRequest`).
   * @param details - Optional additional information about the error.
   */
  constructor(
    message: string,
    httpCode: number = HttpStatusCode.badRequest,
    statusCode: number = ErrorsEnum.badRequest,
    details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
    this.httpCode = httpCode;
    this.statusCode = statusCode;
    this.statusKey = Errors[statusCode];
    this.details = details;
  }
}

export default ApiError;
