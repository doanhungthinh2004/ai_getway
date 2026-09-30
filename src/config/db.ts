import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { env } from './env';
import { logger } from '../utils/logger';

let memoryServer: MongoMemoryServer | undefined;

export async function connectDatabase(): Promise<void> {
  if (!env.mongoUri) {
    memoryServer = await MongoMemoryServer.create();
    env.mongoUri = memoryServer.getUri();
    logger.warn('MONGODB_URI is not configured. Starting in-memory MongoDB for local/demo testing.');
  }

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 8000,
      maxPoolSize: 10,
    });

    logger.info(`MongoDB connected successfully to ${mongoose.connection.name}`);
  } catch (error) {
    logger.error({ error }, 'Failed to connect to MongoDB');
  }
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();

  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = undefined;
  }
}

export function getDatabaseStatus(): 'connected' | 'disconnected' | 'connecting' | 'disconnecting' {
  return mongoose.connection.readyState === 1
    ? 'connected'
    : mongoose.connection.readyState === 2
      ? 'connecting'
      : mongoose.connection.readyState === 3
        ? 'disconnecting'
        : 'disconnected';
}
