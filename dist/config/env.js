"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function parseModelPricing(value) {
    const parsed = JSON.parse(value ?? '{}');
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        throw new Error('AI_MODEL_PRICING must be a JSON object');
    }
    for (const [model, pricing] of Object.entries(parsed)) {
        if (!model ||
            typeof pricing !== 'object' ||
            pricing === null ||
            !Number.isFinite(pricing.inputPerMillionUsd) ||
            pricing.inputPerMillionUsd < 0 ||
            !Number.isFinite(pricing.outputPerMillionUsd) ||
            pricing.outputPerMillionUsd < 0) {
            throw new Error(`AI_MODEL_PRICING contains invalid pricing for model "${model}"`);
        }
    }
    return parsed;
}
exports.env = {
    port: Number(process.env.PORT ?? '5000'),
    mongoUri: process.env.MONGODB_URI ?? '',
    jwtSecret: process.env.JWT_SECRET ?? 'dev-secret',
    openAiApiKey: process.env.OPENAI_API_KEY ?? '',
    openAiModel: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
    aiTimeoutMs: Number(process.env.AI_TIMEOUT_MS ?? '10000'),
    aiMaxRetries: Number(process.env.AI_MAX_RETRIES ?? '2'),
    aiModelPricing: parseModelPricing(process.env.AI_MODEL_PRICING),
    rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS ?? '60000'),
    rateLimitMaxRequests: Number(process.env.RATE_LIMIT_MAX_REQUESTS ?? '60'),
    logLevel: process.env.LOG_LEVEL ?? 'info',
};
