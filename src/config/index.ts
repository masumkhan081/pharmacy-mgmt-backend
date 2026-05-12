import { env } from "./env";

interface Config {
  baseUrl: string;
  appName: string;
  port: number;
  dbName: string;
  dbUrl: string;
  tokenSecret: string;
  refreshTokenSecret: string;
  tokenHeaderKey: string;
  mailHost: string;
  saltRounds: number;
  jwtOptions: {
    expiresIn: string;
  };
  senderMail: string;
  senderMailPassword: string;
  brevoApiKey?: string;
}

const config: Config = {
  baseUrl: process.env.BASE_URL || `http://localhost:${env.PORT}/`,
  appName: "pharmacy-mgmt",
  port: env.PORT,
  dbName: "pharmacy-management",
  dbUrl: env.DB_URL,
  tokenSecret: env.JWT_ACCESS_TOKEN_SECRET,
  refreshTokenSecret: env.JWT_REFRESH_TOKEN_SECRET,
  tokenHeaderKey: env.tkn_header_key,
  mailHost: env.MAIL_HOST,
  saltRounds: 12,
  jwtOptions: {
    expiresIn: "730h", // 30 days
  },
  senderMail: env.SENDER_MAIL || "",
  senderMailPassword: env.SENDER_MAIL_PASSWORD || "",
  brevoApiKey: env.BREVO_API_KEY,
};

export default config;
