"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthController = exports.HealthController = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("../config/env");
class HealthController {
    getHealth(_req, res) {
        const dbStatus = mongoose_1.default.connection.readyState === 1 ? 'connected' : 'disconnected';
        const aiProviderStatus = env_1.env.openAiApiKey ? 'available' : 'demo-mode';
        return res.json({
            success: true,
            data: {
                status: 'ok',
                database: dbStatus,
                ai_provider: aiProviderStatus,
            },
        });
    }
}
exports.HealthController = HealthController;
exports.healthController = new HealthController();
