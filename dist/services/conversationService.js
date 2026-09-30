"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationService = void 0;
const Conversation_1 = require("../models/Conversation");
const error_1 = require("../utils/error");
class ConversationService {
    async listByUser(userId) {
        return Conversation_1.Conversation.find({ userId }).sort({ updatedAt: -1 }).lean();
    }
    async getById(userId, conversationId) {
        const conversation = await Conversation_1.Conversation.findOne({ _id: conversationId, userId }).lean();
        if (!conversation) {
            throw new error_1.AppError('Conversation not found', 'RESOURCE_NOT_FOUND', 404);
        }
        return conversation;
    }
    async create(userId, model, messages) {
        const title = messages[0]?.content?.slice(0, 40) || 'New conversation';
        return Conversation_1.Conversation.create({
            userId,
            title,
            model,
            messages: messages.map((message) => ({
                role: message.role,
                content: message.content,
                createdAt: new Date(),
            })),
        });
    }
    async append(userId, model, messages) {
        const existing = await Conversation_1.Conversation.findOne({ userId }).sort({ updatedAt: -1 });
        if (!existing) {
            return this.create(userId, model, messages);
        }
        existing.messages.push(...messages.map((message) => ({
            role: message.role,
            content: message.content,
            createdAt: new Date(),
        })));
        existing.model = model;
        existing.title = existing.title || 'Conversation';
        await existing.save();
        return existing;
    }
    async remove(userId, conversationId) {
        const result = await Conversation_1.Conversation.deleteOne({ _id: conversationId, userId });
        if (result.deletedCount === 0) {
            throw new error_1.AppError('Conversation not found', 'RESOURCE_NOT_FOUND', 404);
        }
        return { success: true };
    }
}
exports.ConversationService = ConversationService;
