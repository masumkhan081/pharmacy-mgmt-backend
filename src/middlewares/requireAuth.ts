import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/tokenisation";
import { sendUnauthorized } from "../utils/responseHandler";

export interface AuthenticatedRequest extends Request {
  user?: { userId?: string; role?: string; email?: string };
}

const extractBearerToken = (header?: string): string | null => {
  if (!header) return null;
  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() === "bearer" && token) return token;
  return header;
};

const requireAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = extractBearerToken(req.headers.authorization);
  if (!token) {
    sendUnauthorized({ res, message: "Authentication required" });
    return;
  }

  const { success, payload } = verifyToken(token);
  if (!success || !payload) {
    sendUnauthorized({ res, message: "Invalid or expired token" });
    return;
  }

  req.user = {
    userId: payload.userId,
    role: payload.role,
    email: payload.email,
  };
  next();
};

export default requireAuth;
