import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

type ValidationTarget = "body" | "query" | "params";
type ValidationEntries = Partial<Record<ValidationTarget, ZodType>>;

export const validationMiddleware = (
  validationEntries: ValidationEntries
) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      for (const key of Object.keys(validationEntries) as ValidationTarget[]) {
        const schema = validationEntries[key];
        if (!schema) continue;

        const result = schema.safeParse(req[key]);

        if (!result.success)
          throw result.error;

        req[key] = result.data;
      }

      return next();
    } catch (err) {
      return next(err);
    }
  };
};
