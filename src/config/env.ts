import { z } from "zod";
import dotenv from "dotenv";

// Load .env into process.env first
dotenv.config();

// If there are suffixed env keys (e.g. DATABASE_URL_DEV, DATABASE_URL_PROD),
// pick the one matching NODE_ENV and assign it to the base key.
const normalizeEnvByNodeEnv = () => {
  const nodeEnv = (process.env.NODE_ENV || "development").toLowerCase();
  const suffix = nodeEnv === "production" ? "PROD" : nodeEnv === "test" ? "TEST" : "DEV";

  for (const k of Object.keys(process.env)) {
    const m = k.match(/^(.+)_((DEV|PROD|TEST))$/i);
    if (m) {
      const base = m[1];
      const keySuffix = m[2].toUpperCase();
      if (keySuffix === suffix) {
        process.env[base] = process.env[k];
      }
    }
  }
};

normalizeEnvByNodeEnv();

const envSchema = z.object({
  PORT: z.string().transform(Number).default("3000"),
  DB_URL: z.string({
    required_error: "DB_URL is required",
  }),
  DATABASE_URL: z.string({
    required_error: "DATABASE_URL is required",
  }),
  JWT_ACCESS_TOKEN_SECRET: z.string({
    required_error: "JWT_ACCESS_TOKEN_SECRET is required",
  }),
  JWT_REFRESH_TOKEN_SECRET: z.string({
    required_error: "JWT_REFRESH_TOKEN_SECRET is required",
  }),
  tkn_header_key: z.string().default("authorization"),
  MAIL_HOST: z.string().default("smtp.gmail.com"),
  SENDER_MAIL: z.string().email().optional(),
  SENDER_MAIL_PASSWORD: z.string().optional(),
  BREVO_API_KEY: z.string().optional(), // Adding Brevo as mentioned in requirements
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const validateEnv = () => {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error(
      "❌ Invalid environment variables:",
      JSON.stringify(parsed.error.format(), null, 2)
    );
    process.exit(1);
  }

  return parsed.data;
};

export const env = validateEnv();
