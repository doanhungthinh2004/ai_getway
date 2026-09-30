"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const error_1 = require("../utils/error");
function errorHandler(err, req, res, _next) {
    if (err instanceof error_1.AppError) {
        return res.status(err.statusCode).json((0, error_1.buildErrorResponse)(req.requestId ?? 'unknown', err.code, err.message));
    }
    const message = err instanceof Error ? err.message : 'Internal server error';
    return res.status(500).json((0, error_1.buildErrorResponse)(req.requestId ?? 'unknown', 'INTERNAL_SERVER_ERROR', 'Internal server error'));
}
