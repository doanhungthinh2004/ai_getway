"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const db_1 = require("./config/db");
const logger_1 = require("./utils/logger");
async function startServer() {
    await (0, db_1.connectDatabase)();
    app_1.app.listen(app_1.port, () => {
        logger_1.logger.info(`AI Gateway running on http://localhost:${app_1.port}`);
    });
}
startServer().catch((error) => {
    logger_1.logger.error({ error }, 'Failed to start server');
    process.exit(1);
});
