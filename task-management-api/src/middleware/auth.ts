import type { Request, Response, NextFunction } from 'express';
import { authService } from '@/services';
import { UnauthorizedError } from '@/utils/errors';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      throw new UnauthorizedError('No token provided');
    }

    const payload = authService.verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (error) {
    next(new UnauthorizedError('Invalid or expired token'));
  }
};

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      const payload = authService.verifyAccessToken(token);
      req.user = payload;
    }
    next();
  } catch {
    next();
  }
};

declare module 'express' {
  interface Request {
    user?: { userId: string; email: string };
  }
}