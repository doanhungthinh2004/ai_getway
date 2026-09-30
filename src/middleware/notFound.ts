import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/error';

export function notFoundHandler(req: Request, _res: Response, next: NextFunction) {
  next(new AppError(`Route not found: ${req.originalUrl}`, 'RESOURCE_NOT_FOUND', 404));
}
