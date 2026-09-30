"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIProvider = void 0;
const openai_1 = __importDefault(require("openai"));
const error_1 = require("../utils/error");
const env_1 = require("../config/env");
class OpenAIProvider {
    client;
    constructor() {
        if (env_1.env.openAiApiKey) {
            this.client = new openai_1.default({ apiKey: env_1.env.openAiApiKey });
        }
        else {
            this.client = null;
        }
    }
    async chat(request) {
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
    async analyze(request) {
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
            const parsed = JSON.parse(raw);
            const valid = this.validateSchema(parsed, request.schema);
            if (!valid) {
                throw new error_1.AppError('AI response did not match the required structured schema', 'AI_INVALID_RESPONSE', 502);
            }
            return parsed;
        }
        catch (error) {
            if (error instanceof error_1.AppError) {
                throw error;
            }
            throw new error_1.AppError('AI response could not be parsed as valid JSON', 'AI_INVALID_RESPONSE', 502);
        }
    }
    validateSchema(value, schema) {
        if (typeof value !== 'object' || value === null || Array.isArray(value)) {
            return false;
        }
        const entries = Object.entries(schema);
        for (const [key, expectedType] of entries) {
            const currentValue = value[key];
            if (currentValue === undefined)
                return false;
            if (typeof expectedType === 'string') {
                if (typeof currentValue !== expectedType)
                    return false;
            }
        }
        return true;
    }
}
exports.OpenAIProvider = OpenAIProvider;
