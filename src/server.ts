import { app, port } from './app';
import { connectDatabase } from './config/db';
import { logger } from './utils/logger';

async function startServer() {
  await connectDatabase();

  app.listen(port, () => {
    logger.info(`AI Gateway running on http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  logger.error({ error }, 'Failed to start server');
  process.exit(1);
});
