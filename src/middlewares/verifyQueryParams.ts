import { Request, Response, NextFunction } from "express";
import { mapSearchable } from "../config/constants";

const validateQueryParams =
  (entity: string) => (req: Request, res: Response, next: NextFunction) => {
    const validParams = [...mapSearchable[entity], "searchBy", "search"];

    const invalidParams = Object.keys(req.query).filter(
      (key) => !validParams.includes(key)
    );

    if (
      typeof req.query.searchBy === "string" &&
      !validParams.includes(req.query.searchBy)
    ) {
      invalidParams.push(req.query.searchBy);
    }

    if (invalidParams.length > 0) {
      return res.status(400).json({
        error: `Invalid query parameters: ${invalidParams.join(", ")}`,
      });
    }

    next();
  };

export default validateQueryParams;
