"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usageController = exports.UsageController = void 0;
const usageService_1 = require("../services/usageService");
const usageService = new usageService_1.UsageService();
class UsageController {
    async getUsage(req, res, next) {
        try {
            const from = typeof req.query.from === 'string' ? req.query.from : undefined;
            const to = typeof req.query.to === 'string' ? req.query.to : undefined;
            const metrics = await usageService.getMetrics(from, to);
            return res.json({ success: true, data: metrics });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UsageController = UsageController;
exports.usageController = new UsageController();
