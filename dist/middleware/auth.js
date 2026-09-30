"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const error_1 = require("../utils/error");
function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new error_1.AppError('Unauthorized', 'AUTH_UNAUTHORIZED', 401));
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.jwtSecret);
        req.user = {
            id: decoded.id,
            email: decoded.email,
        };
        next();
    }
    catch (error) {
        next(new error_1.AppError('Invalid or expired token', 'AUTH_INVALID_CREDENTIALS', 401));
    }
}
