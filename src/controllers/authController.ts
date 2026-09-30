import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { registerSchema, loginSchema } from '../schemas/auth';
import { AppError } from '../utils/error';
import { env } from '../config/env';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = registerSchema.safeParse(req.body);

      if (!parsed.success) {
        throw new AppError('Validation failed', 'VALIDATION_ERROR', 400);
      }

      const { name, email, password } = parsed.data;
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        throw new AppError('User already exists', 'AUTH_INVALID_CREDENTIALS', 409);
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, passwordHash });

      const token = jwt.sign({ id: user._id.toString(), email: user.email }, env.jwtSecret, {
        expiresIn: '7d',
      });

      return res.status(201).json({
        success: true,
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
          },
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = loginSchema.safeParse(req.body);

      if (!parsed.success) {
        throw new AppError('Validation failed', 'VALIDATION_ERROR', 400);
      }

      const { email, password } = parsed.data;
      const user = await User.findOne({ email });

      if (!user) {
        throw new AppError('Invalid email or password', 'AUTH_INVALID_CREDENTIALS', 401);
      }

      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        throw new AppError('Invalid email or password', 'AUTH_INVALID_CREDENTIALS', 401);
      }

      const token = jwt.sign({ id: user._id.toString(), email: user.email }, env.jwtSecret, {
        expiresIn: '7d',
      });

      return res.json({
        success: true,
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
          },
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 'AUTH_UNAUTHORIZED', 401);
      }

      const user = await User.findById(req.user.id).select('-passwordHash');

      if (!user) {
        throw new AppError('User not found', 'RESOURCE_NOT_FOUND', 404);
      }

      return res.json({
        success: true,
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
