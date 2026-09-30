import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../utils/logger';

export async function connectDatabase(): Promise<void> {
  if (!env.mongoUri) {
    logger.warn('MONGODB_URI is not configured. Skipping database connection in demo mode.');
    return;
  }

  try {
    await mongoose.connect(env.mongoUri);
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error({ error }, 'Failed to connect to MongoDB');
  }
}
