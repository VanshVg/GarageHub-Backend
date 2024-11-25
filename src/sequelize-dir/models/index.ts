import fs from "fs";
import path from "path";
import { DATABASE_URL, NODE_ENV } from "@config";
import { ModelCtor, Sequelize } from "sequelize-typescript";
import { logger } from "@/common/logger";

let db: Sequelize;

export const initSequelize = () => {
  const _basename = path.basename(module.filename);
  const sequelize = new Sequelize(DATABASE_URL, {
    dialect: "postgres",
    logging: NODE_ENV !== "production" && logger.info.bind(null, "\n%s"),
    dialectOptions:
      NODE_ENV === "production"
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false, // Use this if you encounter SSL certificate issues
            },
          }
        : undefined,
    pool:
      NODE_ENV === "production"
        ? {
            min: 0,
            max: 5000,
            idle: 10000,
            acquire: 60000,
          }
        : undefined,
  });

  const _models = fs
    .readdirSync(__dirname)
    .filter((file: string) => {
      return (
        file !== _basename &&
        file !== "interfaces" &&
        file.slice(-5) !== ".d.ts" &&
        (file.slice(-3) === ".js" || file.slice(-3) === ".ts")
      );
    })
    .map((file: string) => {
      const model: ModelCtor = require(path.join(__dirname, file))?.default;
      return model;
    });

  sequelize.addModels(_models);
  return sequelize;
};

if (!db) {
  db = initSequelize();
}

export default db;
