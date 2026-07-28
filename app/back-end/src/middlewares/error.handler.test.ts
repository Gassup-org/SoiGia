import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import config from '../config/app.config.ts';
import { ErrorResponse, errorHandler } from './error.handler.ts';

type MockResponse = Response & {
  status: jest.Mock;
  json: jest.Mock;
  badRequest: jest.Mock;
  unauthorized: jest.Mock;
  paymentRequired: jest.Mock;
  forbidden: jest.Mock;
  notFound: jest.Mock;
  methodNotAllowed: jest.Mock;
  requestTimeout: jest.Mock;
  conflict: jest.Mock;
  gone: jest.Mock;
  unsupportedMediaType: jest.Mock;
  unprocessableEntity: jest.Mock;
  tooManyRequests: jest.Mock;
  internalServerError: jest.Mock;
  notImplemented: jest.Mock;
  badGateway: jest.Mock;
  serviceUnavailable: jest.Mock;
  gatewayTimeout: jest.Mock;
};

const helperNames = [
  'badRequest',
  'unauthorized',
  'paymentRequired',
  'forbidden',
  'notFound',
  'methodNotAllowed',
  'requestTimeout',
  'conflict',
  'gone',
  'unsupportedMediaType',
  'unprocessableEntity',
  'tooManyRequests',
  'internalServerError',
  'notImplemented',
  'badGateway',
  'serviceUnavailable',
  'gatewayTimeout',
] as const;

const createMockResponse = () => {
  const res = {
    status: jest.fn(),
    json: jest.fn(),
  } as unknown as MockResponse;

  res.status.mockReturnValue(res);
  res.json.mockReturnValue(res);

  // errorHandler phụ thuộc responseHandler đã gắn sẵn helper vào res trong app runtime.
  for (const helperName of helperNames) {
    // Gán qua Record để mock được các helper có overload generic khác nhau trên Express.Response.
    (res as unknown as Record<typeof helperName, jest.Mock>)[helperName] = jest.fn().mockReturnValue(res);
  }

  return res;
};

describe('ErrorResponse', () => {
  it('stores status, message, errors, and a failed success flag', () => {
    const errors = [{ field: 'email', message: 'Invalid email' }];
    const error = new ErrorResponse(422, 'Validation failed', errors);

    expect(error).toBeInstanceOf(Error);
    expect(error.success).toBe(false);
    expect(error.status).toBe(422);
    expect(error.message).toBe('Validation failed');
    expect(error.errors).toBe(errors);
  });
});

describe('errorHandler', () => {
  let req: Request;
  let res: MockResponse;
  let next: NextFunction;
  let consoleErrorSpy: jest.SpiedFunction<typeof console.error>;
  let originalNodeEnv: string;

  beforeEach(() => {
    req = {} as Request;
    res = createMockResponse();
    next = jest.fn() as unknown as NextFunction;
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    originalNodeEnv = config.NODE_ENV;
  });

  afterEach(() => {
    (config as { NODE_ENV: string }).NODE_ENV = originalNodeEnv;
    consoleErrorSpy.mockRestore();
  });

  it.each([
    [400, 'badRequest'],
    [401, 'unauthorized'],
    [402, 'paymentRequired'],
    [403, 'forbidden'],
    [404, 'notFound'],
    [405, 'methodNotAllowed'],
    [408, 'requestTimeout'],
    [409, 'conflict'],
    [410, 'gone'],
    [415, 'unsupportedMediaType'],
    [422, 'unprocessableEntity'],
    [429, 'tooManyRequests'],
    [501, 'notImplemented'],
    [502, 'badGateway'],
    [503, 'serviceUnavailable'],
    [504, 'gatewayTimeout'],
  ] as const)('delegates mapped ErrorResponse status %s to res.%s', (status, helperName) => {
    const errors = { reason: 'duplicate' };

    const result = errorHandler(new ErrorResponse(status, 'Request failed', errors), req, res, next);

    expect(result).toBe(res);
    expect(res[helperName]).toHaveBeenCalledWith('Request failed', errors);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('returns raw JSON for ErrorResponse statuses without a mapped helper', () => {
    const errors = { retryAfter: 30 };

    const result = errorHandler(new ErrorResponse(418, 'Teapot', errors), req, res, next);

    // Status ngoài map vẫn giữ payload chuẩn tối thiểu để không làm mất thông tin lỗi.
    expect(result).toBe(res);
    expect(res.status).toHaveBeenCalledWith(418);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 418,
        message: 'Teapot',
        errors,
        timestamp: expect.any(String),
      }),
    );
  });

  it('delegates Zod validation errors to badRequest with issue details', () => {
    const result = z.object({ name: z.string() }).safeParse({});

    if (result.success) {
      throw new Error('Expected validation to fail');
    }

    errorHandler(result.error, req, res, next);

    expect(res.badRequest).toHaveBeenCalledWith('Validation error', result.error.issues);
    expect(res.internalServerError).not.toHaveBeenCalled();
  });

  it('returns a generic internal server error for unexpected errors', () => {
    const error = new Error('Database unavailable');

    const result = errorHandler(error, req, res, next);

    expect(result).toBe(res);
    expect(res.internalServerError).toHaveBeenCalledWith('Internal server error', undefined);
  });

  it('includes error details for unexpected errors in development', () => {
    (config as { NODE_ENV: string }).NODE_ENV = 'development';
    const error = new Error('Database unavailable');

    errorHandler(error, req, res, next);

    // Chỉ development mới trả chi tiết lỗi để tránh lộ stack trace ở môi trường khác.
    expect(res.internalServerError).toHaveBeenCalledWith(
      'Internal server error',
      expect.objectContaining({
        message: 'Database unavailable',
        stack: expect.any(String),
      }),
    );
  });
});
