import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
// import { Error } from "mongoose";
// import { ValidationError } from "mongoose";

// The reusable ID type
export type IDType = Types.ObjectId | string;

export type TypeController = (req: Request, res: Response) => Promise<void> | void;


export type TypeReqResNext = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export interface TypeResponsePayload {
  res: Response;
  result: unknown;
  entity: string;
}

// export interface ErrorPayload {
//   res: Response; // Express Response object
//   error:
//     | {
//         message?: string; // Optional message describing the error
//         code?: number; // Numeric error code (e.g., 404, 11000)
//         errors?: Record<string, { message: string }>; // Mongoose validation errors
//       }
//     | ValidationError; // Support Mongoose's ValidationError directly
//   entity?: string; // Optional name of the entity involved in the error
// }

export interface QueryParams {
  search?: string;
  page?: string | number;
  limit?: string | number;
  searchBy?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  [key: string]: unknown; // Use unknown for additional, unspecified properties
}
