"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = connectDatabase;
exports.disconnectDatabase = disconnectDatabase;
exports.getDatabaseStatus = getDatabaseStatus;
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const env_1 = require("./env");
const logger_1 = require("../utils/logger");
let memoryServer;
async function connectDatabase() {
    if (!env_1.env.mongoUri) {
        memoryServer = await mongodb_memory_server_1.MongoMemoryServer.create();
        env_1.env.mongoUri = memoryServer.getUri();
        logger_1.logger.warn('MONGODB_URI is not configured. Starting in-memory MongoDB for local/demo testing.');
    }
    try {
        mongoose_1.default.set('strictQuery', true);
        await mongoose_1.default.connect(env_1.env.mongoUri, {
            serverSelectionTimeoutMS: 8000,
            maxPoolSize: 10,
        });
        logger_1.logger.info(`MongoDB connected successfully to ${mongoose_1.default.connection.name}`);
    }
    catch (error) {
        logger_1.logger.error({ error }, 'Failed to connect to MongoDB');
    }
}
async function disconnectDatabase() {
    await mongoose_1.default.disconnect();
    if (memoryServer) {
        await memoryServer.stop();
        memoryServer = undefined;
    }
}
function getDatabaseStatus() {
    return mongoose_1.default.connection.readyState === 1
        ? 'connected'
        : mongoose_1.default.connection.readyState === 2
            ? 'connecting'
            : mongoose_1.default.connection.readyState === 3
                ? 'disconnecting'
                : 'disconnected';
}
