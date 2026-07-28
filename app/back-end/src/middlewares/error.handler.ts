import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import config from '../config/app.config.ts';

export class ErrorResponse<E = any> extends Error {
  public readonly success = false;
  public readonly status: number;
  public readonly errors?: E;

  constructor(status: number, message: string, errors?: E) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

export const errorHandler = (
  error: Error, _req: Request, res: Response, _next: NextFunction
) => {
  console.error('[Error hanlder]: ', error);

  if (error instanceof ErrorResponse) {
    const statusMap: Record<number, Function> = {
      400: res.badRequest,
      401: res.unauthorized,
      402: res.paymentRequired,
      403: res.forbidden,
      404: res.notFound,
      405: res.methodNotAllowed,
      408: res.requestTimeout,
      409: res.conflict,
      410: res.gone,
      415: res.unsupportedMediaType,
      422: res.unprocessableEntity,
      429: res.tooManyRequests,
      501: res.notImplemented,
      502: res.badGateway,
      503: res.serviceUnavailable,
      504: res.gatewayTimeout,
    }

    const handler = statusMap[error.status];
    if (handler)
      return handler(error.message, error.errors);

    return res.status(error.status).json({
      status: error.status,
      message: error.message,
      ...(error.errors !== undefined && { errors: error.errors }),
      timestamp: new Date().toISOString(),
    });
  }


  if (error instanceof ZodError) {
    return res.badRequest("Validation error", error.issues);
  }

  // Xử lý các lỗi Unhandled/Crash hệ thống không xác định (500)
  const isDev = config.NODE_ENV === "development";

  return res.internalServerError(
    "Internal server error",
    isDev ? { message: error.message, stack: error.stack } : undefined
  );
}