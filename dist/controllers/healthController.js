"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthController = exports.HealthController = void 0;
const env_1 = require("../config/env");
const db_1 = require("../config/db");
class HealthController {
    getHealth(_req, res) {
        const dbStatus = (0, db_1.getDatabaseStatus)();
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
