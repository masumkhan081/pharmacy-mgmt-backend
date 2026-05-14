import { Request, Response, NextFunction } from "express";
import { mapSearchable } from "../config/constants";
import { sendBadRequest } from "../utils/responseHandler";

const validateQueryParams =
  (entity: string) => (req: Request, res: Response, next: NextFunction) => {
    const validParams = [...mapSearchable[entity], "searchBy", "search"];

    const invalidParams = Object.keys(req.query).filter(
      (key) => !validParams.includes(key),
    );

    if (
      typeof req.query.searchBy === "string" &&
      !validParams.includes(req.query.searchBy)
    ) {
      invalidParams.push(req.query.searchBy);
    }

    if (invalidParams.length > 0) {
      sendBadRequest({
        res,
        message: `Invalid query parameters: ${invalidParams.join(", ")}`,
        errors: invalidParams.map((p) => ({ field: p, message: "Invalid parameter" })),
      });
      return;
    }

    next();
  };

export default validateQueryParams;
