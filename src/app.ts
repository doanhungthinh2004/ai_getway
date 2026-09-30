import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { swaggerSpec, swaggerUiHandler } from './config/swagger';
import { requestIdMiddleware } from './middleware/requestId';
import { apiRateLimiter } from './middleware/rateLimiter';
import { authRouter } from './routes/auth.routes';
import { aiRouter } from './routes/ai.routes';
import { conversationRouter } from './routes/conversation.routes';
import { usageRouter } from './routes/usage.routes';
import { healthRouter } from './routes/health.routes';
import { notFoundHandler } from './middleware/notFound';
import { errorHandler } from './middleware/errorHandler';

export const app = express();

app.use(cors({ origin: true }));
app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(requestIdMiddleware);
app.use('/api', apiRateLimiter);
app.use('/api-docs', swaggerUi.serve, swaggerUiHandler);

app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'AI Gateway API is running',
  });
});

app.use('/api/auth', authRouter);
app.use('/api/ai', aiRouter);
app.use('/api/conversations', conversationRouter);
app.use('/api/usage', usageRouter);
app.use('/api/health', healthRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export const port = env.port;
