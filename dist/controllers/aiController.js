"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiController = exports.AIController = void 0;
const aiService_1 = require("../services/aiService");
const ai_1 = require("../schemas/ai");
const error_1 = require("../utils/error");
const conversationService_1 = require("../services/conversationService");
const usageService_1 = require("../services/usageService");
const logger_1 = require("../utils/logger");
const aiService = new aiService_1.AIService();
const conversationService = new conversationService_1.ConversationService();
const usageService = new usageService_1.UsageService();
class AIController {
    async chat(req, res, next) {
        try {
            const parsed = ai_1.chatSchema.safeParse(req.body);
            if (!parsed.success) {
                throw new error_1.AppError('Validation failed', 'VALIDATION_ERROR', 400);
            }
            const { model, messages, temperature } = parsed.data;
            const startedAt = Date.now();
            const result = await aiService.chat({ model, messages, temperature });
            const latencyMs = Date.now() - startedAt;
            if (req.user) {
                await conversationService.append(req.user.id, model, [
                    ...messages,
                    { role: 'assistant', content: result.data.message.content },
                ]);
            }
            const usageRecord = {
                userId: req.user?.id ?? 'anonymous',
                model,
                latencyMs,
                inputTokens: result.data.usage.input_tokens,
                outputTokens: result.data.usage.output_tokens,
                totalTokens: result.data.usage.total_tokens,
                status: 'success',
                requestId: req.requestId ?? 'unknown',
                provider: 'openai',
            };
            try {
                if (req.user) {
                    await usageService.recordUsage(usageRecord);
                }
            }
            catch (error) {
                logger_1.logger.warn({ error }, 'Usage log record skipped because DB is not available');
            }
            return res.json({
                success: true,
                data: {
                    message: result.data.message,
                    model: result.data.model,
                },
                usage: {
                    input_tokens: result.data.usage.input_tokens,
                    output_tokens: result.data.usage.output_tokens,
                    total_tokens: result.data.usage.total_tokens,
                },
                meta: {
                    request_id: req.requestId ?? 'unknown',
                    latency_ms: latencyMs,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    async analyze(req, res, next) {
        try {
            const parsed = ai_1.analyzeSchema.safeParse(req.body);
            if (!parsed.success) {
                throw new error_1.AppError('Validation failed', 'VALIDATION_ERROR', 400);
            }
            const { model, input, schema } = parsed.data;
            const result = await aiService.analyze(model, input, schema);
            const latencyMs = result.latencyMs;
            if (req.user) {
                await conversationService.append(req.user.id, model, [
                    { role: 'user', content: `Structured analysis: ${input}` },
                    { role: 'assistant', content: JSON.stringify(result.data) },
                ]);
            }
            try {
                if (req.user) {
                    await usageService.recordUsage({
                        userId: req.user.id,
                        model,
                        latencyMs,
                        inputTokens: 0,
                        outputTokens: 0,
                        totalTokens: 0,
                        status: 'success',
                        requestId: req.requestId ?? 'unknown',
                        provider: 'openai',
                    });
                }
            }
            catch (error) {
                logger_1.logger.warn({ error }, 'Usage log record skipped');
            }
            return res.json({
                success: true,
                data: result.data,
                meta: {
                    request_id: req.requestId ?? 'unknown',
                    latency_ms: latencyMs,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AIController = AIController;
exports.aiController = new AIController();
