import { AppError } from '../utils/error';
import { OpenAIProvider } from '../providers/OpenAIProvider';
import { AIProvider, ChatMessage } from '../providers/AIProvider';
import { logger } from '../utils/logger';

export interface ChatServiceRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
}

export class AIService {
  private provider: AIProvider;

  constructor(provider?: AIProvider) {
    this.provider = provider ?? new OpenAIProvider();
  }

  async chat(request: ChatServiceRequest) {
    const start = Date.now();

    try {
      const response = await this.provider.chat({
        model: request.model,
        messages: request.messages,
        temperature: request.temperature ?? 0.7,
      });

      const latencyMs = Date.now() - start;

      return {
        success: true,
        data: response,
        latencyMs,
      };
    } catch (error) {
      logger.error({ error }, 'AI provider chat failed');
      throw new AppError('AI provider request failed', 'AI_PROVIDER_ERROR', 502);
    }
  }

  async analyze(model: string, input: string, schema: Record<string, unknown>) {
    const start = Date.now();

    try {
      const result = await this.provider.analyze({ model, input, schema });
      const latencyMs = Date.now() - start;

      return {
        success: true,
        data: result,
        latencyMs,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      logger.error({ error }, 'AI provider analyze failed');
      throw new AppError('AI provider request failed', 'AI_PROVIDER_ERROR', 502);
    }
  }
}
