import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

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
