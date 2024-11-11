import winston from "winston";
import { basename, join } from "path";
import { existsSync, mkdirSync } from "fs";
import WinstonDaily from "winston-daily-rotate-file";
import { LOG_DIR } from "@/config";

// logs dir
const logDir = join(process.cwd(), LOG_DIR);

if (!existsSync(logDir)) {
  mkdirSync(logDir);
}

const fileLogFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.label({
    label: basename(require?.main?.filename || "server"),
  }),
  winston.format.metadata({
    fillExcept: ["message", "level", "timestamp", "label"],
  }),
  winston.format.json()
);

export const consoleLogFormat = winston.format.combine(
  winston.format.splat(),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message, label }) => {
    return `${timestamp} ${level} [${label}]: ${message}`;
  })
);

export const logger = winston.createLogger({
  format: fileLogFormat,
  transports: [
    // debug log setting
    new WinstonDaily({
      level: "debug",
      datePattern: "YYYY-MM-DD",
      dirname: `${logDir}/debug`, // log file /logs/debug/*.log in save
      filename: "%DATE%.log",
      maxFiles: 30, // 30 Days saved
      json: false,
      zippedArchive: true,
    }),
    // error log setting
    new WinstonDaily({
      level: "error",
      datePattern: "YYYY-MM-DD",
      dirname: `${logDir}/error`, // log file /logs/error/*.log in save
      filename: "%DATE%.log",
      maxFiles: 30, // 30 Days saved
      handleExceptions: true,
      json: false,
      zippedArchive: true,
    }),
  ],
});

logger.add(
  new winston.transports.Console({
    format: consoleLogFormat,
  })
);

export const stream = {
  write: (message: string) => {
    logger.info(message.substring(0, message.lastIndexOf("\n")));
  },
};

export const configData = Object.freeze({
  // Default timer=>5 minutes
  defaultTimer: 300000,
  // At least schedule time
  atLeastTimer: 120000,
  // default undo time
  default_undo_time: 20000,
});
