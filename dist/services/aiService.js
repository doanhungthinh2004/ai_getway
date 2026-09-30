"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIService = void 0;
const error_1 = require("../utils/error");
const OpenAIProvider_1 = require("../providers/OpenAIProvider");
const logger_1 = require("../utils/logger");
class AIService {
    provider;
    constructor(provider) {
        this.provider = provider ?? new OpenAIProvider_1.OpenAIProvider();
    }
    async chat(request) {
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
        }
        catch (error) {
            logger_1.logger.error({ error }, 'AI provider chat failed');
            throw new error_1.AppError('AI provider request failed', 'AI_PROVIDER_ERROR', 502);
        }
    }
    async analyze(model, input, schema) {
        const start = Date.now();
        try {
            const result = await this.provider.analyze({ model, input, schema });
            const latencyMs = Date.now() - start;
            return {
                success: true,
                data: result,
                latencyMs,
            };
        }
        catch (error) {
            if (error instanceof error_1.AppError) {
                throw error;
            }
            logger_1.logger.error({ error }, 'AI provider analyze failed');
            throw new error_1.AppError('AI provider request failed', 'AI_PROVIDER_ERROR', 502);
        }
    }
}
exports.AIService = AIService;
