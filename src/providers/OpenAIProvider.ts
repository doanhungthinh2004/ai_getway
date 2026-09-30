import OpenAI from 'openai';
import { AppError } from '../utils/error';
import { env } from '../config/env';
import { AIProvider, ProviderChatResponse, ProviderChatRequest } from './AIProvider';

export class OpenAIProvider implements AIProvider {
  private client: OpenAI | null;

  constructor() {
    if (env.openAiApiKey) {
      this.client = new OpenAI({ apiKey: env.openAiApiKey });
    } else {
      this.client = null;
    }
  }

  async chat(request: ProviderChatRequest): Promise<ProviderChatResponse> {
    if (!this.client) {
      return {
        message: {
          role: 'assistant',
          content: `Demo response for model ${request.model}. Add OPENAI_API_KEY to enable real provider calls.`,
        },
        model: request.model,
        usage: {
          input_tokens: 10,
          output_tokens: 12,
          total_tokens: 22,
        },
      };
    }

    const completion = await this.client.chat.completions.create({
      model: request.model,
      messages: request.messages,
      temperature: request.temperature ?? 0.7,
    });

    const content = completion.choices[0]?.message?.content ?? 'No response returned';

    return {
      message: {
        role: 'assistant',
        content,
      },
      model: request.model,
      usage: {
        input_tokens: completion.usage?.prompt_tokens ?? 0,
        output_tokens: completion.usage?.completion_tokens ?? 0,
        total_tokens: completion.usage?.total_tokens ?? 0,
      },
    };
  }

  async analyze(request: { model: string; input: string; schema: Record<string, unknown> }): Promise<Record<string, unknown>> {
    const systemPrompt = `Return valid JSON only that matches this schema exactly: ${JSON.stringify(request.schema)}. Do not wrap the result in markdown fences.`;

    const response = await this.chat({
      model: request.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: request.input },
      ],
      temperature: 0,
    });

    const raw = response.message.content.trim();

    try {
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      const valid = this.validateSchema(parsed, request.schema);

      if (!valid) {
        throw new AppError('AI response did not match the required structured schema', 'AI_INVALID_RESPONSE', 502);
      }

      return parsed;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError('AI response could not be parsed as valid JSON', 'AI_INVALID_RESPONSE', 502);
    }
  }

  private validateSchema(value: unknown, schema: Record<string, unknown>): boolean {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      return false;
    }

    const entries = Object.entries(schema);
    for (const [key, expectedType] of entries) {
      const currentValue = (value as Record<string, unknown>)[key];
      if (currentValue === undefined) return false;
      if (typeof expectedType === 'string') {
        if (typeof currentValue !== expectedType) return false;
      }
    }

    return true;
  }
}
