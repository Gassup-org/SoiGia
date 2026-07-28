import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { validationMiddleware } from './validation.ts';

describe('validationMiddleware', () => {
  let res: Response;
  let next: jest.Mock;

  beforeEach(() => {
    res = {} as Response;
    next = jest.fn();
  });

  it('validates and replaces body, query, and params with parsed data', () => {
    const req = {
      body: { name: '  Coffee  ', price: '12000' },
      query: { page: '2' },
      params: { id: '123' },
    } as unknown as Request;

    const middleware = validationMiddleware({
      body: z.object({
        name: z.string().trim(),
        price: z.coerce.number(),
      }),
      query: z.object({
        page: z.coerce.number().int(),
      }),
      params: z.object({
        id: z.coerce.number().int(),
      }),
    });

    middleware(req, res, next as unknown as NextFunction);

    // Middleware ghi lại dữ liệu đã parse để các handler phía sau dùng type/format sạch hơn.
    expect(req.body).toEqual({ name: 'Coffee', price: 12000 });
    expect(req.query).toEqual({ page: 2 });
    expect(req.params).toEqual({ id: 123 });
    expect(next).toHaveBeenCalledWith();
  });

  it('skips validation targets that do not have a schema', () => {
    const req = {
      body: { name: 'Coffee' },
      query: { page: '2' },
      params: { id: '123' },
    } as unknown as Request;

    const middleware = validationMiddleware({
      body: z.object({ name: z.string() }),
      query: undefined,
    });

    middleware(req, res, next as unknown as NextFunction);

    // Entry undefined được bỏ qua để caller có thể build object schema có điều kiện.
    expect(req.body).toEqual({ name: 'Coffee' });
    expect(req.query).toEqual({ page: '2' });
    expect(req.params).toEqual({ id: '123' });
    expect(next).toHaveBeenCalledWith();
  });

  it.each([
    ['body', { body: { price: 'invalid' } }, { body: z.object({ price: z.coerce.number() }) }],
    ['query', { query: { page: 'invalid' } }, { query: z.object({ page: z.coerce.number().int() }) }],
    ['params', { params: { id: 'invalid' } }, { params: z.object({ id: z.coerce.number().int() }) }],
  ] as const)('passes %s validation errors to the next error middleware', (_target, requestData, validationEntries) => {
    const req = {
      body: {},
      query: {},
      params: {},
      ...requestData,
    } as unknown as Request;

    const middleware = validationMiddleware(validationEntries);

    middleware(req, res, next as unknown as NextFunction);

    const error = next.mock.calls[0][0];
    expect(error).toBeInstanceOf(z.ZodError);
  });
});
