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
    if (!this.client) {
      const demoResult = this.buildDemoStructuredOutput(request.schema, request.input);
      const valid = this.validateSchema(demoResult, request.schema);

      if (!valid) {
        throw new AppError('AI response did not match the required structured schema', 'AI_INVALID_RESPONSE', 502);
      }

      return demoResult;
    }

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
        if (expectedType === 'integer') {
          if (!Number.isInteger(currentValue)) return false;
          continue;
        }

        if (typeof currentValue !== expectedType) return false;
      }
    }

    return true;
  }

  private buildDemoStructuredOutput(schema: Record<string, unknown>, input: string): Record<string, unknown> {
    const normalized = input.toLowerCase();
    const sentiment = /good|great|easy|fast|love|excellent|positive|happy|satisfied/i.test(normalized)
      ? 'positive'
      : /bad|slow|confusing|hard|hate|negative|frustrating|poor/i.test(normalized)
        ? 'negative'
        : 'neutral';

    const score = sentiment === 'positive' ? 0.82 : sentiment === 'negative' ? 0.28 : 0.55;
    const summary = input.trim().length > 0 ? input.trim() : 'No input provided.';

    const result: Record<string, unknown> = {};

    for (const [key, expectedType] of Object.entries(schema)) {
      if (typeof expectedType !== 'string') {
        result[key] = key === 'summary' ? summary : '';
        continue;
      }

      switch (expectedType) {
        case 'string':
          result[key] =
            key === 'sentiment'
              ? sentiment
              : key === 'summary'
                ? summary
                : `${key} demo value`;
          break;
        case 'number':
          result[key] = key === 'score' ? score : 0;
          break;
        case 'boolean':
          result[key] = sentiment === 'positive';
          break;
        case 'object':
          result[key] = { source: 'demo' };
          break;
        case 'integer':
          result[key] = key === 'count' ? 1 : 0;
          break;
        default:
          result[key] = '';
          break;
      }
    }

    return result;
  }
}
