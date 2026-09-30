import { Request, Response, NextFunction } from 'express';
import { UsageService } from '../services/usageService';

const usageService = new UsageService();

export class UsageController {
  async getUsage(req: Request, res: Response, next: NextFunction) {
    try {
      const from = typeof req.query.from === 'string' ? req.query.from : undefined;
      const to = typeof req.query.to === 'string' ? req.query.to : undefined;

      const metrics = await usageService.getMetrics(from, to);
      return res.json({ success: true, data: metrics });
    } catch (error) {
      next(error);
    }
  }
}

export const usageController = new UsageController();
