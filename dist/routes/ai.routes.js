"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiRouter = void 0;
const express_1 = require("express");
const aiController_1 = require("../controllers/aiController");
const auth_1 = require("../middleware/auth");
exports.aiRouter = (0, express_1.Router)();
/**
 * @openapi
 * /api/ai/chat:
 *   post:
 *     summary: Chat with AI provider
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Chat completed
 */
exports.aiRouter.post('/chat', auth_1.requireAuth, aiController_1.aiController.chat.bind(aiController_1.aiController));
/**
 * @openapi
 * /api/ai/analyze:
 *   post:
 *     summary: Analyze input with structured output
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Structured result returned
 */
exports.aiRouter.post('/analyze', auth_1.requireAuth, aiController_1.aiController.analyze.bind(aiController_1.aiController));
