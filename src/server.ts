import { initializeApp } from "./app";
import { logger } from "./common/logger";
import authRoutes from "./modules/auth/routes";
import garageRoutes from "./modules/garage/routes";
import serviceRoutes from "./modules/service/routes";
import db from "./sequelize-dir/models";

const main = async () => {
  try {
    await db.authenticate();
    const apiRoutes = [authRoutes(), garageRoutes(), serviceRoutes()];

    await initializeApp(apiRoutes, db);
  } catch (error) {
    logger.error("[SERVER START]: %s", error?.message);
    process.exit(1);
  }
};

main();
