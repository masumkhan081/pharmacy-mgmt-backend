import { Response } from "express";
import { TypeResponsePayload } from "../types/requestResponse";
//
interface ErrorPayload {
  res: Response;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
  entity?: string; // Optional entity for specific error messages
}
//
export const sendSingleFetchResponse = ({
  res,
  result,
  entity,
}: TypeResponsePayload) => {
  const statusCode: number = result
    ? responseMap.fetch.code
    : responseMap.notFound.code;
  res.status(statusCode).json({
    statusCode,
    success: result ? true : false,
    message: result
      ? responseMap.fetch.message(entity)
      : responseMap.idNotFound.message(entity),
    data: result,
  });
};
//
export const sendFetchResponse = ({
  res,
  result,
  entity,
}: TypeResponsePayload) => {
  if (result instanceof Error) {
    return sendErrorResponse({
      res,
      error: result,
      entity,
    });
  }
  const statusCode: number = responseMap.fetch.code;
  res.status(statusCode).json({
    statusCode,
    success: true,
    message: responseMap.fetch.message(entity),
    data: result,
  });
};
// 
export function sendCreateResponse({ res, result, entity }: TypeResponsePayload) {
  const statusCode: number = responseMap.create.code;
  res.status(statusCode).json({
    statusCode,
    success: true,
    message: responseMap.create.message(entity),
    result,
  });
}

export function sendUpdateResponse({ res, result, entity }: TypeResponsePayload) {
  const { update, notFound, idNotFound } = responseMap;
  const isSuccess = Boolean(result);
  const statusCode: number = isSuccess ? update.code : notFound.code;

  res.status(statusCode).json({
    statusCode,
    success: isSuccess,
    message: isSuccess ? update.message(entity) : idNotFound.message(entity),
    result,
  });
}

export function sendDeletionResponse({ res, result, entity }: TypeResponsePayload) {
  const statusCode: number = result ? responseMap.delete.code : responseMap.notFound.code;
  res.status(statusCode).json({
    statusCode,
    success: result ? true : false,
    message: result
      ? responseMap.delete.message(entity)
      : responseMap.idNotFound.message(entity),
    result,
  });
}

export const sendErrorResponse = ({
  res,
  error,
  entity,
}: ErrorPayload): void => {
  let statusCode = 500;
  let message = "An unexpected error occurred";
  const messages: Record<string, string> = {};
  let type = "unknown-error";

  console.error("sendErrorResponse:", error.message);

  if (error?.name == "ValidationError") {
    statusCode = 400;
    message = "Invalid data";
    type = "validation-error";
    for (const [field, errorDetail] of Object.entries(error.errors)) {
      messages[field] = (errorDetail as { message: string }).message;
    }
  } else if (error?.code === 11000) {
    statusCode = 409;
    message = "Duplicate key error";
    type = "duplicate-key-error";
  } else if (error?.code === 404) {
    statusCode = 404;
    message = `Resource not found: ${entity}`;
    type = "not-found-error";
  } else if (error?.code === 409) {
    statusCode = 409;
    message = "Conflict error";
    type = "conflict-error";
  } else {
    statusCode = 500;
    message = "Server error";
    type = "server-error";
  }

  const errorResponse = {
    statusCode,
    success: false,
    message,
    messages,
    type,
  };

  res.status(statusCode).json(errorResponse);
};

export const responseMap = {
  create: {
    code: 201,
    message: (entity: string) => `${entity}  created successfully`,
  },
  delete: {
    code: 200,
    message: (entity: string) => `${entity} deleted successfully`,
  },
  update: {
    code: 200,
    message: (entity: string) => `${entity} updated successfully`,
  },
  fetch: {
    code: 200,
    message: (entity: string) => `${entity} fetched successfully`,
  },

  idNotFound: {
    code: 404,
    message: (entity: string) => `No resource (${entity}) with this ID.`,
  },
  alreadyExist: {
    code: 409, // Error code for "conflict" or "Already Exists" as mongodb return
    message: (entity: string) => `Resource (${entity}) already exists`,
  },
  alreadyUsed: {
    code: 409, // HTTP status code for "Conflict"
    message: (entity: string) =>
      `Cannot delete ${entity}: Resource is already used by other entities`,
  },
  //
  invalid: { code: 500, message: "Invalid Request" },
  badRequest: { code: 500, message: "Bad Request" },
  notFound: { code: 404, message: (entity: string) => `${entity} not found` },
  serverError: { code: 500, message: "Internal Server Error" },
  somethingWentWrong: { code: 500, message: "Something went wrong" },
  unauthorized: { code: 500, message: "Unauthorized Access" },
  forbidden: { code: 500, message: "Forbidden Access" },

  noData: { code: 204, message: `No Data` },
  failInUpdate: {
    code: 1000,
    message: (entity: string) => `${entity} failed to update`,
  },
  //

  creationFailed: { code: 400, message: "Creation failed" },
};
