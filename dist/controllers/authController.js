"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const auth_1 = require("../schemas/auth");
const error_1 = require("../utils/error");
const env_1 = require("../config/env");
class AuthController {
    async register(req, res, next) {
        try {
            const parsed = auth_1.registerSchema.safeParse(req.body);
            if (!parsed.success) {
                throw new error_1.AppError('Validation failed', 'VALIDATION_ERROR', 400);
            }
            const { name, email, password } = parsed.data;
            const existingUser = await User_1.User.findOne({ email });
            if (existingUser) {
                throw new error_1.AppError('User already exists', 'AUTH_INVALID_CREDENTIALS', 409);
            }
            const passwordHash = await bcrypt_1.default.hash(password, 10);
            const user = await User_1.User.create({ name, email, passwordHash });
            const token = jsonwebtoken_1.default.sign({ id: user._id.toString(), email: user.email }, env_1.env.jwtSecret, {
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
        }
        catch (error) {
            next(error);
        }
    }
    async login(req, res, next) {
        try {
            const parsed = auth_1.loginSchema.safeParse(req.body);
            if (!parsed.success) {
                throw new error_1.AppError('Validation failed', 'VALIDATION_ERROR', 400);
            }
            const { email, password } = parsed.data;
            const user = await User_1.User.findOne({ email });
            if (!user) {
                throw new error_1.AppError('Invalid email or password', 'AUTH_INVALID_CREDENTIALS', 401);
            }
            const isValidPassword = await bcrypt_1.default.compare(password, user.passwordHash);
            if (!isValidPassword) {
                throw new error_1.AppError('Invalid email or password', 'AUTH_INVALID_CREDENTIALS', 401);
            }
            const token = jsonwebtoken_1.default.sign({ id: user._id.toString(), email: user.email }, env_1.env.jwtSecret, {
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
        }
        catch (error) {
            next(error);
        }
    }
    async me(req, res, next) {
        try {
            if (!req.user) {
                throw new error_1.AppError('Unauthorized', 'AUTH_UNAUTHORIZED', 401);
            }
            const user = await User_1.User.findById(req.user.id).select('-passwordHash');
            if (!user) {
                throw new error_1.AppError('User not found', 'RESOURCE_NOT_FOUND', 404);
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
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
