import { AppError } from '../utils/error';
import OpenAI from 'openai';
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
      throw this.toProviderError(error, 'AI provider chat failed');
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
      throw this.toProviderError(error, 'AI provider analyze failed');
    }
  }

  private toProviderError(error: unknown, logMessage: string): AppError {
    if (error instanceof AppError) {
      return error;
    }

    logger.error({ error }, logMessage);

    if (error instanceof OpenAI.APIConnectionTimeoutError) {
      return new AppError('AI provider request timed out', 'AI_PROVIDER_TIMEOUT', 504);
    }

    return new AppError('AI provider request failed', 'AI_PROVIDER_ERROR', 502);
  }
}
