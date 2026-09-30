"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeSchema = exports.chatSchema = void 0;
const zod_1 = require("zod");
exports.chatSchema = zod_1.z.object({
    model: zod_1.z.string().min(1),
    messages: zod_1.z
        .array(zod_1.z.object({
        role: zod_1.z.enum(['user', 'assistant', 'system']),
        content: zod_1.z.string().min(1),
    }))
        .min(1),
    temperature: zod_1.z.number().min(0).max(2).optional(),
});
exports.analyzeSchema = zod_1.z.object({
    model: zod_1.z.string().min(1),
    input: zod_1.z.string().min(1),
    schema: zod_1.z.record(zod_1.z.string(), zod_1.z.any()),
});
