const dotEnv = require("dotenv");

dotEnv.config();

module.exports = {
  url: process.env.DATABASE_URL,
  dialect: "postgres",
  dialectOptions:
    process.env.NODE_ENV === "production"
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false, // Use this if you encounter SSL certificate issues
          },
        }
      : undefined,
};
