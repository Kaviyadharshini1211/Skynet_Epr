import type { Knex } from "knex";
import dotenv from "dotenv";

dotenv.config();

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

const config: { development: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      host: getEnv("DB_HOST"),
      port: Number(getEnv("DB_PORT")),
      user: getEnv("DB_USER"),
      password: getEnv("DB_PASSWORD"),
      database: getEnv("DB_NAME"),
    },
    migrations: {
      directory: "./src/db/migrations",
    },
    seeds: {
      directory: "./src/db/seeds",
    },
  },
};

export default config;