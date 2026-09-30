"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.port = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const env_1 = require("./config/env");
const swagger_1 = require("./config/swagger");
const requestId_1 = require("./middleware/requestId");
const rateLimiter_1 = require("./middleware/rateLimiter");
const auth_routes_1 = require("./routes/auth.routes");
const ai_routes_1 = require("./routes/ai.routes");
const conversation_routes_1 = require("./routes/conversation.routes");
const usage_routes_1 = require("./routes/usage.routes");
const health_routes_1 = require("./routes/health.routes");
const notFound_1 = require("./middleware/notFound");
const errorHandler_1 = require("./middleware/errorHandler");
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)({ origin: true }));
exports.app.use((0, helmet_1.default)());
exports.app.use(express_1.default.json({ limit: '1mb' }));
exports.app.use(requestId_1.requestIdMiddleware);
exports.app.use('/api', rateLimiter_1.apiRateLimiter);
exports.app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_1.swaggerUiHandler);
exports.app.get('/', (_req, res) => {
    res.json({
        success: true,
        message: 'AI Gateway API is running',
    });
});
exports.app.use('/api/auth', auth_routes_1.authRouter);
exports.app.use('/api/ai', ai_routes_1.aiRouter);
exports.app.use('/api/conversations', conversation_routes_1.conversationRouter);
exports.app.use('/api/usage', usage_routes_1.usageRouter);
exports.app.use('/api/health', health_routes_1.healthRouter);
exports.app.use(notFound_1.notFoundHandler);
exports.app.use(errorHandler_1.errorHandler);
exports.port = env_1.env.port;
