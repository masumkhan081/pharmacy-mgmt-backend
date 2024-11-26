import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
// import config from "../config/index";
import utilsToken from "../utils/tokenisation";

const { verifyToken } = utilsToken;

interface RequestWithUser extends Request {
  userId?: string;
  role?: string;
}

function accessControl(accessRoles: string[]) {
  return async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response> => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        return res.status(httpStatus.FORBIDDEN).json({
          success: false,
          message: "Access Forbidden!",
        });
      }

      const { success, payload } = verifyToken(token);

      if (!success) {
        return res.status(httpStatus.FORBIDDEN).json({
          success: false,
          message: "Access Forbidden!",
        });
      }

      req.userId = payload?.userId;
      req.role = payload?.role;

      if (accessRoles.includes(req.role as string)) {
        // handle possible undefined role
        next();
      } else {
        return res.status(httpStatus.FORBIDDEN).json({
          success: false,
          message: "Access Forbidden!",
        });
      }
    } catch (error) {
      console.error(
        "Error at accessControl:",
        error instanceof Error ? error.message : "Unknown error",
      );
      return res.status(httpStatus.FORBIDDEN).json({
        success: false,
        message: "Access Forbidden!",
      });
    }
  };
}

export default accessControl;
