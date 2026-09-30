"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.env = {
    port: Number(process.env.PORT ?? '5000'),
    mongoUri: process.env.MONGODB_URI ?? '',
    jwtSecret: process.env.JWT_SECRET ?? 'dev-secret',
    openAiApiKey: process.env.OPENAI_API_KEY ?? '',
    openAiModel: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
    aiTimeoutMs: Number(process.env.AI_TIMEOUT_MS ?? '10000'),
    aiMaxRetries: Number(process.env.AI_MAX_RETRIES ?? '2'),
    rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS ?? '60000'),
    rateLimitMaxRequests: Number(process.env.RATE_LIMIT_MAX_REQUESTS ?? '60'),
    logLevel: process.env.LOG_LEVEL ?? 'info',
};
