import { Request, Response, NextFunction } from "express";
import { sendBadRequest } from "../utils/responseHandler";

export const validateObjectId = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { id } = req.params;
  
  // Standard UUID validation
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  if (!isUuid) {
    sendBadRequest({
      res,
      message: "Invalid ID format. Please provide a valid UUID.",
      errors: [{ field: "id", message: String(id) }],
    });
    return;
  }
  next();
};
