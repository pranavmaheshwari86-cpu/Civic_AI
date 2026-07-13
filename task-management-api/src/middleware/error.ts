import type { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '@/utils/errors';
import { logger } from '@/utils/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error('Error occurred', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      ...(err instanceof ValidationError && { errors: err.errors }),
    });
  }

  const isProduction = process.env.NODE_ENV === 'production';
  return res.status(500).json({
    status: 'error',
    message: isProduction ? 'Internal server error' : err.message,
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.method} ${req.path} not found`,
  });
};

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};