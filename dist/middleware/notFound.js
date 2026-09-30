"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = notFoundHandler;
const error_1 = require("../utils/error");
function notFoundHandler(req, _res, next) {
    next(new error_1.AppError(`Route not found: ${req.originalUrl}`, 'RESOURCE_NOT_FOUND', 404));
}
