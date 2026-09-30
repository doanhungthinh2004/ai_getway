"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestIdMiddleware = requestIdMiddleware;
const requestId_1 = require("../utils/requestId");
function requestIdMiddleware(req, res, next) {
    const requestId = req.get('X-Request-ID') ?? (0, requestId_1.generateRequestId)();
    req.requestId = requestId;
    res.setHeader('X-Request-ID', requestId);
    next();
}
