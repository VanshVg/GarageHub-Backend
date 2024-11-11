import { initializeApp } from "./app";
import { logger } from "./lib/logger";
import db from "./sequelize-dir/models";

const main = async () => {
  try {
    await db.authenticate();
    const apiRoutes = [];

    await initializeApp(apiRoutes, db);
  } catch (error) {
    logger.error("[SERVER START]: %s", error?.message);
    process.exit(1);
  }
};

main();
