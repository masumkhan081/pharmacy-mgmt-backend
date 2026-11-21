import cors, { CorsOptions } from "cors";

// List of allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173",
  "https://pharmacy-mgmt.vercel.app",
  "https://pharmacy-mgmt-web.vercel.app",
];

const isVercelDomain = (origin: string): boolean => {
  try {
    const url = new URL(origin);
    return url.hostname.endsWith(".vercel.app");
  } catch {
    return false;
  }
};

// Define CORS options type
const corsOptions: CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow: boolean) => void,
  ) => {
    if (!origin || allowedOrigins.includes(origin) || isVercelDomain(origin)) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error("Not allowed by CORS"), false); // Deny the request
    }
  },
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
};

// Export the CORS middleware
export default cors(corsOptions);
