import dotenv from "dotenv";
import { defineConfig, env } from "prisma/config";

// load correct env manually
dotenv.config({
  path:
    process.env.NODE_ENV === "production"
      ? ".env.production"
      : ".env.development",
});

export default defineConfig({
  // Correct structure for Prisma 7
  schema: "./prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
