import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { NextFunction, Request, Response } from 'express';
import { responseHandler } from './rest.response.ts';

type MockResponse = Response & {
  status: jest.Mock;
  json: jest.Mock;
  send: jest.Mock;
  redirect: jest.Mock;
};

const createMockResponse = () => {
  // Mock các method Express mà responseHandler gọi, đồng thời giữ chain `res.status().json()`.
  const res = {
    status: jest.fn(),
    json: jest.fn(),
    send: jest.fn(),
    redirect: jest.fn(),
  } as unknown as MockResponse;

  res.status.mockReturnValue(res);
  res.json.mockReturnValue(res);
  res.send.mockReturnValue(res);

  return res;
};

describe('responseHandler', () => {
  let req: Request;
  let res: MockResponse;
  let next: jest.Mock;

  beforeEach(() => {
    req = {} as Request;
    res = createMockResponse();
    next = jest.fn();

    // responseHandler gắn các helper như res.ok/res.badRequest vào response cho từng request.
    responseHandler(req, res, next as unknown as NextFunction);
  });

  it('attaches response helpers and continues to the next middleware', () => {
    const helperNames = [
      'ok',
      'created',
      'accepted',
      'noContent',
      'movedPermanently',
      'found',
      'seeOther',
      'notModified',
      'temporaryRedirect',
      'permanentRedirect',
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

    // Đảm bảo middleware attach đủ helper vào response trước khi route handler sử dụng.
    for (const helperName of helperNames) {
      expect(res[helperName]).toEqual(expect.any(Function));
    }
    expect(next).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['ok', 200, 'Success'],
    ['created', 201, 'Created'],
    ['accepted', 202, 'Accepted'],
  ] as const)('sends %s successful JSON responses with the standard envelope', (helperName, status, defaultMessage) => {
    const data = { id: 'product-1' };

    const result = res[helperName]('Product loaded', data);

    expect(result).toBe(res);
    expect(res.status).toHaveBeenCalledWith(status);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        status,
        message: 'Product loaded',
        data,
        timestamp: expect.any(String),
      }),
    );

    jest.clearAllMocks();

    res[helperName]();

    // Default message là contract chính của helper khi caller không truyền message.
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        status,
        message: defaultMessage,
        timestamp: expect.any(String),
      }),
    );
  });

  it.each([
    ['badRequest', 400, 'Bad Request'],
    ['unprocessableEntity', 422, 'Unprocessable Entity'],
    ['internalServerError', 500, 'Internal Server Error'],
  ] as const)('sends %s failed JSON responses with errors in the standard envelope', (helperName, status, defaultMessage) => {
    const errors = [{ path: ['name'], message: 'Required' }];

    const result = res[helperName]('Validation failed', errors);

    expect(result).toBe(res);
    expect(res.status).toHaveBeenCalledWith(status);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        status,
        message: 'Validation failed',
        errors,
        timestamp: expect.any(String),
      }),
    );

    jest.clearAllMocks();

    res[helperName]();

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        status,
        message: defaultMessage,
        timestamp: expect.any(String),
      }),
    );
  });

  it.each([
    ['unauthorized', 401, 'Unauthorized'],
    ['paymentRequired', 402, 'Payment Required'],
    ['forbidden', 403, 'Forbidden'],
    ['notFound', 404, 'Not Found'],
    ['methodNotAllowed', 405, 'Method Not Allowed'],
    ['requestTimeout', 408, 'Request Timeout'],
    ['conflict', 409, 'Conflict'],
    ['gone', 410, 'Resource Gone'],
    ['unsupportedMediaType', 415, 'Unsupported Media Type'],
    ['tooManyRequests', 429, 'Too Many Requests'],
    ['notImplemented', 501, 'Not Implemented'],
    ['badGateway', 502, 'Bad Gateway'],
    ['serviceUnavailable', 503, 'Service Unavailable'],
    ['gatewayTimeout', 504, 'Gateway Timeout'],
  ] as const)('sends %s failed JSON responses without an errors payload', (helperName, status, defaultMessage) => {
    const result = res[helperName]('Custom failure');

    expect(result).toBe(res);
    expect(res.status).toHaveBeenCalledWith(status);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        status,
        message: 'Custom failure',
        timestamp: expect.any(String),
      }),
    );

    jest.clearAllMocks();

    res[helperName]();

    const body = res.json.mock.calls[0][0] as Record<string, unknown>;
    expect(body).toEqual(
      expect.objectContaining({
        success: false,
        status,
        message: defaultMessage,
        timestamp: expect.any(String),
      }),
    );
    expect(body).not.toHaveProperty('data');
    expect(body).not.toHaveProperty('errors');
  });

  it('does not include optional data or errors when they are not provided', () => {
    res.notFound();

    // Kiểm tra payload thực tế được gửi, không chỉ kiểm tra mock json đã được gọi.
    const body = res.json.mock.calls[0][0] as Record<string, unknown>;

    expect(res.status).toHaveBeenCalledWith(404);
    expect(body).toEqual(
      expect.objectContaining({
        success: false,
        status: 404,
        message: 'Not Found',
        timestamp: expect.any(String),
      }),
    );
    expect(body).not.toHaveProperty('data');
    expect(body).not.toHaveProperty('errors');
  });

  it('sends empty-body responses without JSON payloads', () => {
    res.noContent();

    // HTTP 204 và 304 không nên trả JSON body.
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.json).not.toHaveBeenCalled();

    jest.clearAllMocks();

    res.notModified();

    expect(res.status).toHaveBeenCalledWith(304);
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.json).not.toHaveBeenCalled();
  });

  it.each([
    ['movedPermanently', 301],
    ['found', 302],
    ['seeOther', 303],
    ['temporaryRedirect', 307],
    ['permanentRedirect', 308],
  ] as const)('redirects with the expected HTTP status code for %s', (helperName, status) => {
    // Redirect helper dùng res.redirect(status, url) thay vì JSON envelope.
    expect(res[helperName]('/new-url')).toBe(res);
    expect(res.redirect).toHaveBeenCalledWith(status, '/new-url');
    expect(res.json).not.toHaveBeenCalled();
  });
});
