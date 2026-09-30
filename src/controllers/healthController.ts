import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { env } from '../config/env';

export class HealthController {
  getHealth(_req: Request, res: Response) {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    const aiProviderStatus = env.openAiApiKey ? 'available' : 'demo-mode';

    return res.json({
      success: true,
      data: {
        status: 'ok',
        database: dbStatus,
        ai_provider: aiProviderStatus,
      },
    });
  }
}

export const healthController = new HealthController();
