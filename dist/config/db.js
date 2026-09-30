"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = connectDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
const logger_1 = require("../utils/logger");
async function connectDatabase() {
    if (!env_1.env.mongoUri) {
        logger_1.logger.warn('MONGODB_URI is not configured. Skipping database connection in demo mode.');
        return;
    }
    try {
        await mongoose_1.default.connect(env_1.env.mongoUri);
        logger_1.logger.info('MongoDB connected successfully');
    }
    catch (error) {
        logger_1.logger.error({ error }, 'Failed to connect to MongoDB');
    }
}
