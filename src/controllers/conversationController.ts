import { Request, Response, NextFunction } from 'express';
import { ConversationService } from '../services/conversationService';

const conversationService = new ConversationService();

export class ConversationController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const items = await conversationService.listByUser(req.user!.id);
      return res.json({ success: true, data: items });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const conversationId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const item = await conversationService.getById(req.user!.id, conversationId);
      return res.json({ success: true, data: item });
    } catch (error) {
      next(error);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const conversationId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await conversationService.remove(req.user!.id, conversationId);
      return res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

export const conversationController = new ConversationController();
