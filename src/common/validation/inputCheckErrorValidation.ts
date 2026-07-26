import type { NextFunction, Request, Response } from 'express';
import { type ValidationError, validationResult } from 'express-validator';
import { HttpStatuses } from '../types/httpStatuses';

export const inputValidation = (req: Request, res: Response, next: NextFunction) => {
  const errorFormatter = (error: ValidationError) => {
    if (error.type === 'field') {
      return {
        message: error.msg,
        field: error.path,
      };
    }
    return {
      message: error.msg,
      field: (error as any).path || 'unknown',
    };
  };

  const result = validationResult(req).formatWith(errorFormatter);
  if (!result.isEmpty())
    return res.status(HttpStatuses.BadRequest).send({ errorsMessages: result.array({ onlyFirstError: true }) });

  return next();
};
