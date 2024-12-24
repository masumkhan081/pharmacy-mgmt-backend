import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
// import config from "../config/index";
import { verifyToken } from "../utils/tokenisation";
import userModel from "../models/user.model";


interface RequestWithUser extends Request {
  userId?: string;
  role?: string;
}

function accessControl(accessRoles: string[]) {
  return async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        res.status(httpStatus.FORBIDDEN).json({
          success: false,
          message: "Access Forbidden!",
        });
        return; // Explicitly return to avoid further execution
      }

      const { success, payload } = verifyToken(token);

      if (!success) {
        res.status(httpStatus.FORBIDDEN).json({
          success: false,
          message: "Invalid token !",
        });
        return;
      }

      const email = payload?.email;

      if (!email) {
        res.status(httpStatus.FORBIDDEN).json({
          success: false,
          message: "Invalid token !",
        });
        return;
      }

      // Retrieve user by email
      const user = await userModel.findOne({ email });

      if (!user) {
        res.status(httpStatus.FORBIDDEN).json({
          success: false,
          message: "Access Forbidden! User not found.",
        });
        return;
      }

      req.userId = user.id;
      req.role = payload?.role;

      if (accessRoles.includes(req.role as string)) {
        console.log("success: \n\n\n")

        next();
      } else {
        res.status(httpStatus.FORBIDDEN).json({
          success: false,
          message: "Access Forbidden!",
        });
      }
    } catch (error) {
      console.error(
        "Error at accessControl:",
        error instanceof Error ? error.message : "Unknown error"
      );
      res.status(httpStatus.FORBIDDEN).json({
        success: false,
        message: "Access Forbidden!",
      });
    }
  };
}

export default accessControl;
