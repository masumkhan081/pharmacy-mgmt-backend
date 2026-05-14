import rateLimit from "express-rate-limit";

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: {
    statusCode: 429,
    success: false,
    message: "Too many login/auth attempts, please try again after 15 minutes",
    data: null,
    meta: null,
    errors: null,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const sensitiveActionRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // limit each IP to 50 requests per windowMs for sensitive actions
  message: {
    statusCode: 429,
    success: false,
    message: "Too many sensitive operations (payment/adjustment), please try again after an hour",
    data: null,
    meta: null,
    errors: null,
  },
  standardHeaders: true,
  legacyHeaders: false,
});
