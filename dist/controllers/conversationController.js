"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conversationController = exports.ConversationController = void 0;
const conversationService_1 = require("../services/conversationService");
const conversationService = new conversationService_1.ConversationService();
class ConversationController {
    async list(req, res, next) {
        try {
            const items = await conversationService.listByUser(req.user.id);
            return res.json({ success: true, data: items });
        }
        catch (error) {
            next(error);
        }
    }
    async getById(req, res, next) {
        try {
            const conversationId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const item = await conversationService.getById(req.user.id, conversationId);
            return res.json({ success: true, data: item });
        }
        catch (error) {
            next(error);
        }
    }
    async remove(req, res, next) {
        try {
            const conversationId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const result = await conversationService.remove(req.user.id, conversationId);
            return res.json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ConversationController = ConversationController;
exports.conversationController = new ConversationController();
