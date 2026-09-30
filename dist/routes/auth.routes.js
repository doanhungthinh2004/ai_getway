"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
exports.authRouter = (0, express_1.Router)();
/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     responses:
 *       201:
 *         description: User created
 */
exports.authRouter.post('/register', authController_1.authController.register.bind(authController_1.authController));
/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     responses:
 *       200:
 *         description: Login successful
 */
exports.authRouter.post('/login', authController_1.authController.login.bind(authController_1.authController));
/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     summary: Get current authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user
 */
exports.authRouter.get('/me', auth_1.requireAuth, authController_1.authController.me.bind(authController_1.authController));
