import { NextFunction, Request, Response } from 'express';
import { generateRequestId } from '../utils/requestId';

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const requestId = req.get('X-Request-ID') ?? generateRequestId();
  req.requestId = requestId;
  res.setHeader('X-Request-ID', requestId);
  next();
}
