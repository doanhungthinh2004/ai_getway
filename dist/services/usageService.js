"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsageService = void 0;
exports.calculateUsageMetrics = calculateUsageMetrics;
const UsageLog_1 = require("../models/UsageLog");
const env_1 = require("../config/env");
function calculateUsageMetrics(logs, modelPricing = env_1.env.aiModelPricing) {
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
class UsageService {
    async recordUsage(input) {
        return UsageLog_1.UsageLog.create({
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
    async getMetrics(from, to) {
        const query = {};
        if (from || to) {
            query.timestamp = {};
            if (from) {
                query.timestamp.$gte = new Date(from);
            }
            if (to) {
                query.timestamp.$lte = new Date(to);
            }
        }
        const logs = await UsageLog_1.UsageLog.find(query).lean();
        return calculateUsageMetrics(logs.map((log) => ({
            totalTokens: Number(log.totalTokens ?? 0),
            model: log.model,
            inputTokens: Number(log.inputTokens ?? 0),
            outputTokens: Number(log.outputTokens ?? 0),
            latencyMs: Number(log.latencyMs ?? 0),
            status: log.status,
        })), env_1.env.aiModelPricing);
    }
}
exports.UsageService = UsageService;
