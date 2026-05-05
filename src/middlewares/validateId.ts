import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { sendBadRequest } from "../utils/responseHandler";

export const validateObjectId = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id)) {
    sendBadRequest({
      res,
      message: "Invalid ID format. Please provide a valid ObjectId.",
      errors: [{ field: "id", message: id }],
    });
    return;
  }
  next();
};
