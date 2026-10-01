import { describe, it, expect } from 'vitest';
import { calculateUsageMetrics } from '../src/services/usageService';
import { chatSchema, analyzeSchema } from '../src/schemas/ai';

describe('usage metrics calculation', () => {
  it('calculates requests, total tokens, average latency and error rate correctly', () => {
    const logs = [
      { totalTokens: 100, latencyMs: 1000, status: 'success' },
      { totalTokens: 200, latencyMs: 2000, status: 'success' },
      { totalTokens: 300, latencyMs: 3000, status: 'error' },
    ];

    const metrics = calculateUsageMetrics(logs);

    expect(metrics.requests).toBe(3);
    expect(metrics.tokens).toBe(600);
    expect(metrics.average_latency_ms).toBe(2000);
    expect(metrics.error_rate).toBe(0.3333);
  });

  it('estimates configured model costs and counts requests without pricing', () => {
    const metrics = calculateUsageMetrics(
      [
        { model: 'priced-model', inputTokens: 1_000_000, outputTokens: 500_000 },
        { model: 'unknown-model', inputTokens: 100, outputTokens: 100 },
      ],
      { 'priced-model': { inputPerMillionUsd: 1, outputPerMillionUsd: 2 } },
    );

    expect(metrics.estimated_cost_usd).toBe(2);
    expect(metrics.unpriced_requests).toBe(1);
  });
});

describe('AI request validation', () => {
  it('accepts a valid chat payload', () => {
    const result = chatSchema.safeParse({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'Explain API Gateway' }],
      temperature: 0.7,
    });

    expect(result.success).toBe(true);
  });

  it('accepts a valid structured analysis payload', () => {
    const result = analyzeSchema.safeParse({
      model: 'gpt-4o-mini',
      input: 'Analyze customer feedback',
      schema: {
        sentiment: 'string',
        score: 'number',
        summary: 'string',
      },
    });

    expect(result.success).toBe(true);
  });
});
