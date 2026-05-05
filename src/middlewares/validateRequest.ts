import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodIssue } from "zod";
import { sendBadRequest } from "../utils/responseHandler";

const validateRequest =
  (requestBodySchema: ZodSchema) =>
    (req: Request, res: Response, next: NextFunction): void => {
      const valid = requestBodySchema.safeParse(req.body);

      if (valid.success) {
        return next();
      }

      const errors = valid.error.issues.map((issue: ZodIssue) => ({
        field: String(issue.path[0] ?? ""),
        message: issue.message,
      }));

      sendBadRequest({ res, message: "Invalid data", errors });
    };

export default validateRequest;
