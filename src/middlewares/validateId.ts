import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose"; // Import mongoose's Types for ObjectId validation

// Middleware to validate ObjectId
export const validateObjectId = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { id } = req.params;

  // Check if the id is a valid MongoDB ObjectId
  if (!Types.ObjectId.isValid(id)) {
    // Send a response if the ID is invalid, no need to call next()
    res.status(400).json({
      success: false,
      message: "Invalid ID format. Please provide a valid ObjectId.",
    });
    return;
  }

  // If the ID is valid, continue to the next middleware or route handler
  next();
};
