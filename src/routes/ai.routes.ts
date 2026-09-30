import { Router } from 'express';
import { aiController } from '../controllers/aiController';
import { requireAuth } from '../middleware/auth';

export const aiRouter = Router();

/**
 * @openapi
 * /api/ai/chat:
 *   post:
 *     summary: Chat with AI provider
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Chat completed
 */
aiRouter.post('/chat', requireAuth, aiController.chat.bind(aiController));

/**
 * @openapi
 * /api/ai/analyze:
 *   post:
 *     summary: Analyze input with structured output
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Structured result returned
 */
aiRouter.post('/analyze', requireAuth, aiController.analyze.bind(aiController));
