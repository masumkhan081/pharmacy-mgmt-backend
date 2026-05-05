import { Response, NextFunction } from "express";
import { verifyToken } from "../utils/tokenisation";
import userModel from "../models/user.model";
import {
  sendForbidden,
  sendUnauthorized,
} from "../utils/responseHandler";
import { AuthenticatedRequest } from "./requireAuth";

const extractBearerToken = (header?: string): string | null => {
  if (!header) return null;
  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() === "bearer" && token) return token;
  return header;
};

function accessControl(accessRoles: string[]) {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      let role = req.user?.role;
      let userId = req.user?.userId;

      if (!role) {
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
        role = payload.role;
        userId = payload.userId;

        if (payload.email) {
          const user = await userModel.findOne({ email: payload.email });
          if (!user) {
            sendForbidden({ res, message: "User not found" });
            return;
          }
          userId = user.id;
        }

        req.user = { userId, role, email: payload.email };
      }

      if (!role || !accessRoles.includes(role)) {
        sendForbidden({
          res,
          message: "You do not have permission to perform this action",
        });
        return;
      }

      next();
    } catch (error) {
      console.error(
        "accessControl error:",
        error instanceof Error ? error.message : error
      );
      sendForbidden({ res, message: "Access check failed" });
    }
  };
}

export default accessControl;
