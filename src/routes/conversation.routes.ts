import { Router } from 'express';
import { conversationController } from '../controllers/conversationController';
import { requireAuth } from '../middleware/auth';

export const conversationRouter = Router();

conversationRouter.get('/', requireAuth, conversationController.list.bind(conversationController));
conversationRouter.get('/:id', requireAuth, conversationController.getById.bind(conversationController));
conversationRouter.delete('/:id', requireAuth, conversationController.remove.bind(conversationController));
