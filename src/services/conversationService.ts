import { Conversation, IConversation } from '../models/Conversation';
import { AppError } from '../utils/error';

export class ConversationService {
  async listByUser(userId: string) {
    return Conversation.find({ userId }).sort({ updatedAt: -1 }).lean();
  }

  async getById(userId: string, conversationId: string) {
    const conversation = await Conversation.findOne({ _id: conversationId, userId }).lean();

    if (!conversation) {
      throw new AppError('Conversation not found', 'RESOURCE_NOT_FOUND', 404);
    }

    return conversation;
  }

  async create(userId: string, model: string, messages: Array<{ role: string; content: string }>) {
    const title = messages[0]?.content?.slice(0, 40) || 'New conversation';

    return Conversation.create({
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

  async append(userId: string, model: string, messages: Array<{ role: string; content: string }>) {
    const existing = await Conversation.findOne({ userId }).sort({ updatedAt: -1 });

    if (!existing) {
      return this.create(userId, model, messages);
    }

    existing.messages.push(
      ...messages.map((message) => ({
        role: message.role,
        content: message.content,
        createdAt: new Date(),
      })),
    );
    existing.model = model;
    existing.title = existing.title || 'Conversation';
    await existing.save();

    return existing;
  }

  async remove(userId: string, conversationId: string) {
    const result = await Conversation.deleteOne({ _id: conversationId, userId });

    if (result.deletedCount === 0) {
      throw new AppError('Conversation not found', 'RESOURCE_NOT_FOUND', 404);
    }

    return { success: true };
  }
}
