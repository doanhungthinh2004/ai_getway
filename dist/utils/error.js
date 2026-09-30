"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
exports.buildErrorResponse = buildErrorResponse;
class AppError extends Error {
    statusCode;
    code;
    constructor(message, code, statusCode) {
        super(message);
        this.name = 'AppError';
        this.code = code;
        this.statusCode = statusCode;
    }
}
exports.AppError = AppError;
function buildErrorResponse(requestId, code, message) {
    return {
        success: false,
        error: {
            code,
            message,
            requestId,
        },
    };
}
