import cors from "cors";

// List of allowed origins
const allowedOrigins = [
  "http://localhost:3001",
  "http://localhost:5173",
  "http://localhost:5000",
];

// Export the CORS middleware
const corsMiddleware = cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
});
 

export default corsMiddleware;
