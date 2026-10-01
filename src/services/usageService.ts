import { UsageLog } from '../models/UsageLog';
import { env, type ModelPricing } from '../config/env';

export interface UsageMetricSummary {
  requests: number;
  tokens: number;
  average_latency_ms: number;
  error_rate: number;
  estimated_cost_usd: number;
  unpriced_requests: number;
}

export function calculateUsageMetrics(
  logs: Array<{
    model?: string;
    inputTokens?: number;
    outputTokens?: number;
    totalTokens?: number;
    latencyMs?: number;
    status?: string;
  }>,
  modelPricing: Record<string, ModelPricing> = env.aiModelPricing,
): UsageMetricSummary {
  const requests = logs.length;
  const tokens = logs.reduce((sum, log) => sum + Number(log.totalTokens ?? 0), 0);
  const totalLatency = logs.reduce((sum, log) => sum + Number(log.latencyMs ?? 0), 0);
  const averageLatency = requests > 0 ? totalLatency / requests : 0;
  const errors = logs.filter((log) => log.status === 'error').length;
  const errorRate = requests > 0 ? errors / requests : 0;
  let estimatedCostUsd = 0;
  let unpricedRequests = 0;

  for (const log of logs) {
    const pricing = log.model ? modelPricing[log.model] : undefined;
    if (!pricing) {
      unpricedRequests += 1;
      continue;
    }

    estimatedCostUsd +=
      (Number(log.inputTokens ?? 0) * pricing.inputPerMillionUsd +
        Number(log.outputTokens ?? 0) * pricing.outputPerMillionUsd) /
      1_000_000;
  }

  return {
    requests,
    tokens,
    average_latency_ms: Number(averageLatency.toFixed(2)),
    error_rate: Number(errorRate.toFixed(4)),
    estimated_cost_usd: Number(estimatedCostUsd.toFixed(8)),
    unpriced_requests: unpricedRequests,
  };
}

export class UsageService {
  async recordUsage(input: {
    userId: string;
    model: string;
    latencyMs: number;
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    status: 'success' | 'error';
    errorCode?: string;
    errorMessage?: string;
    requestId: string;
    provider?: string;
  }) {
    return UsageLog.create({
      userId: input.userId,
      model: input.model,
      timestamp: new Date(),
      latencyMs: input.latencyMs,
      inputTokens: input.inputTokens,
      outputTokens: input.outputTokens,
      totalTokens: input.totalTokens,
      status: input.status,
      errorCode: input.errorCode,
      errorMessage: input.errorMessage,
      requestId: input.requestId,
      provider: input.provider ?? 'openai',
    });
  }

  async getMetrics(from?: string, to?: string): Promise<UsageMetricSummary> {
    const query: Record<string, unknown> = {};

    if (from || to) {
      query.timestamp = {} as Record<string, unknown>;
      if (from) {
        (query.timestamp as Record<string, Date>).$gte = new Date(from);
      }
      if (to) {
        (query.timestamp as Record<string, Date>).$lte = new Date(to);
      }
    }

    const logs = await UsageLog.find(query).lean();
    return calculateUsageMetrics(
      logs.map((log) => ({
        totalTokens: Number(log.totalTokens ?? 0),
        model: log.model,
        inputTokens: Number(log.inputTokens ?? 0),
        outputTokens: Number(log.outputTokens ?? 0),
        latencyMs: Number(log.latencyMs ?? 0),
        status: log.status,
      })),
      env.aiModelPricing,
    );
  }
}
