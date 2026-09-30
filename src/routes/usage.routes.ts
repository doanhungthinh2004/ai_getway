import { Router } from 'express';
import { usageController } from '../controllers/usageController';
import { requireAuth } from '../middleware/auth';

export const usageRouter = Router();

usageRouter.get('/', requireAuth, usageController.getUsage.bind(usageController));
