import cors, { CorsOptions } from "cors";

// List of allowed origins
const allowedOrigins = [
  "http://localhost:3001",
  "http://localhost:5173",
  "https://pharmacy-mgmt.vercel.app"
];

// Define CORS options type
const corsOptions: CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow: boolean) => void,
  ) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error("Not allowed by CORS"), false); // Deny the request
    }
  },
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  credentials: true, // Allow credentials such as cookies
};

// Export the CORS middleware

export default cors(corsOptions);
