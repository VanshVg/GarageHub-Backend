import express, { Application, Router } from "express";
import { Sequelize } from "sequelize";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.middleware";
import { logger } from "./common/logger";
import { PORT } from "./config";
import * as http from "http";
import { passportMiddleware } from "./middlewares/passport.middleware";
import User from "./sequelize-dir/models/users.model";
import Garage from "./sequelize-dir/models/garages.model";

declare module "express" {
  interface Request {
    user: User;
    garage: Garage;
  }
}

const port: string | number = PORT || 8000;

const app: Application = express();

const initializeMiddlewares = (app: Application) => {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};

const initializeRoutes = (app: Application, routes: Router[]) => {
  routes.forEach((route) => {
    app.use("/", route);
  });
};

const initializeErrorHandling = (app: Application) => {
  app.use(errorMiddleware);
};

const initializePassport = () => {
  passportMiddleware();
};

export const initializeApp = async (apiRouter: Router[], db: Sequelize) => {
  initializeMiddlewares(app);
  initializeRoutes(app, apiRouter);
  initializeErrorHandling(app);
  initializePassport();

  app.listen(port, () => {
    logger.info(`🚀 App listening on port ${port}`);
  });
};

export const exitServerProcess = async (
  server?: http.Server,
  db: Sequelize | null = null
) => {
  process.on("SIGINT", async () => {
    await db?.close?.();
    server?.close((err) => {
      if (err) {
        logger.info(err);
        process.exit(1);
      }
    });
    logger.info("HTTP server closed");
  });

  process.on("SIGTERM", async () => {
    await db?.close?.();
    server?.close((err) => {
      if (err) {
        logger.info(err);
        process.exit(1);
      }
    });
  });
};
