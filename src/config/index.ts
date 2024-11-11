import { config } from "dotenv";

config();

export const { LOG_DIR, PORT, DATABASE_URL, NODE_ENV } = process.env;
