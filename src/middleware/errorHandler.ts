import { NextFunction, Request, Response } from 'express';
import { AppError, buildErrorResponse } from '../utils/error';

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json(buildErrorResponse(req.requestId ?? 'unknown', err.code, err.message));
  }

  const message = err instanceof Error ? err.message : 'Internal server error';
  return res.status(500).json(buildErrorResponse(req.requestId ?? 'unknown', 'INTERNAL_SERVER_ERROR', 'Internal server error'));
}
