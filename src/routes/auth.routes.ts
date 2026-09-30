import { Router } from 'express';
import { authController } from '../controllers/authController';
import { requireAuth } from '../middleware/auth';

export const authRouter = Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     responses:
 *       201:
 *         description: User created
 */
authRouter.post('/register', authController.register.bind(authController));

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     responses:
 *       200:
 *         description: Login successful
 */
authRouter.post('/login', authController.login.bind(authController));

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
authRouter.get('/me', requireAuth, authController.me.bind(authController));
