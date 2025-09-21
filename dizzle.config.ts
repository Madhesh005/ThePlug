import type { Config } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

const config: Config = {
  schema: "./shared/schema.ts",
  out: "./drizzle",
  driver: "pg", // Make sure you have installed drizzle-orm-pg or drizzle-kit supports 'pg'
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
};

export default config;