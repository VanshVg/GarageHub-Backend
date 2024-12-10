import { config } from "dotenv";

config();

export const {
  LOG_DIR,
  PORT,
  DATABASE_URL,
  NODE_ENV,
  MAIL_HOST,
  MAIL_PORT,
  MAIL_USER,
  MAIL_PASSWORD,
  JWT_SECRET,
} = process.env;
