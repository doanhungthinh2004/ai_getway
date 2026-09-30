import { Request, Response } from 'express';
import { env } from '../config/env';
import { getDatabaseStatus } from '../config/db';

export class HealthController {
  getHealth(_req: Request, res: Response) {
    const dbStatus = getDatabaseStatus();
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
