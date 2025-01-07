import * as dotenv from "dotenv";
import { z } from "zod";

const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
dotenv.config({ path: envFile });

const envSchema = z.object({
  // Server
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.string().transform(Number).default("5000"),
  //   HOST: z.string().default('localhost'),

  //   // Database
  DATABASE_URL: z.string(),
  //   DB_HOST: z.string(),
  //   DB_PORT: z.string().transform(Number),
  //   DB_NAME: z.string(),
  //   DB_USER: z.string(),
  //   DB_PASSWORD: z.string(),

  //   // API Keys
  GOOGLE_CLIENT_ID: z.string(),
  //   JWT_SECRET: z.string(),
});

// Validate and export environment variables
const env = envSchema.parse(process.env);

export default env;
