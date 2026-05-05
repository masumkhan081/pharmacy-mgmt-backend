import { Response } from "express";
import { TypeResponsePayload } from "../types/requestResponse";

interface ErrorPayload {
  res: Response;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
  entity?: string;
}

interface FieldError {
  field: string;
  message: string;
}

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
}

interface ListPayload extends TypeResponsePayload {
  pagination?: PaginationMeta;
}

interface AdHocPayload {
  res: Response;
  message: string;
  errors?: FieldError[];
}

const send = (
  res: Response,
  statusCode: number,
  body: Record<string, unknown>
): void => {
  res.status(statusCode).json({ statusCode, ...body });
};

const isPaginatedListShape = (
  value: unknown
): value is { meta: Record<string, unknown>; data: unknown } => {
  return (
    typeof value === "object" &&
    value !== null &&
    "meta" in value &&
    "data" in value
  );
};

export const sendFetchResponse = ({
  res,
  result,
  entity,
}: TypeResponsePayload): void => {
  if (result instanceof Error) {
    return sendErrorResponse({ res, error: result, entity });
  }

  if (isPaginatedListShape(result)) {
    return send(res, responseMap.fetch.code, {
      success: true,
      message: responseMap.fetch.message(entity),
      data: result.data,
      meta: { pagination: result.meta },
    });
  }

  send(res, responseMap.fetch.code, {
    success: true,
    message: responseMap.fetch.message(entity),
    data: result,
  });
};

export const sendSingleFetchResponse = ({
  res,
  result,
  entity,
}: TypeResponsePayload): void => {
  if (!result) {
    return sendNotFound({
      res,
      message: responseMap.idNotFound.message(entity),
    });
  }
  send(res, responseMap.fetch.code, {
    success: true,
    message: responseMap.fetch.message(entity),
    data: result,
  });
};

export const sendListResponse = ({
  res,
  result,
  entity,
  pagination,
}: ListPayload): void => {
  send(res, responseMap.fetch.code, {
    success: true,
    message: responseMap.fetch.message(entity),
    data: result,
    ...(pagination ? { meta: { pagination } } : {}),
  });
};

export const sendCreateResponse = ({
  res,
  result,
  entity,
}: TypeResponsePayload): void => {
  send(res, responseMap.create.code, {
    success: true,
    message: responseMap.create.message(entity),
    data: result,
  });
};

export const sendUpdateResponse = ({
  res,
  result,
  entity,
}: TypeResponsePayload): void => {
  if (!result) {
    return sendNotFound({
      res,
      message: responseMap.idNotFound.message(entity),
    });
  }
  send(res, responseMap.update.code, {
    success: true,
    message: responseMap.update.message(entity),
    data: result,
  });
};

export const sendDeletionResponse = ({
  res,
  result,
  entity,
}: TypeResponsePayload): void => {
  if (!result) {
    return sendNotFound({
      res,
      message: responseMap.idNotFound.message(entity),
    });
  }
  send(res, responseMap.delete.code, {
    success: true,
    message: responseMap.delete.message(entity),
    data: result,
  });
};

export const sendBadRequest = ({
  res,
  message,
  errors,
}: AdHocPayload): void => {
  send(res, 400, {
    success: false,
    message,
    ...(errors ? { errors } : {}),
  });
};

export const sendNotFound = ({ res, message, errors }: AdHocPayload): void => {
  send(res, 404, {
    success: false,
    message,
    ...(errors ? { errors } : {}),
  });
};

export const sendConflict = ({ res, message, errors }: AdHocPayload): void => {
  send(res, 409, {
    success: false,
    message,
    ...(errors ? { errors } : {}),
  });
};

export const sendUnauthorized = ({
  res,
  message,
  errors,
}: AdHocPayload): void => {
  send(res, 401, {
    success: false,
    message,
    ...(errors ? { errors } : {}),
  });
};

export const sendForbidden = ({
  res,
  message,
  errors,
}: AdHocPayload): void => {
  send(res, 403, {
    success: false,
    message,
    ...(errors ? { errors } : {}),
  });
};

export const sendErrorResponse = ({
  res,
  error,
  entity,
}: ErrorPayload): void => {
  let statusCode = 500;
  let message = "An unexpected error occurred";
  let errors: FieldError[] | undefined;

  console.error("sendErrorResponse:", error?.message ?? error);

  if (error?.name === "ValidationError") {
    statusCode = 400;
    message = "Invalid data";
    errors = Object.entries(
      error.errors as Record<string, { message: string }>
    ).map(([field, detail]) => ({ field, message: detail.message }));
  } else if (error?.code === 11000) {
    statusCode = 409;
    message = entity
      ? `Resource (${entity}) already exists`
      : "Duplicate key error";
  } else if (error?.statusCode && error?.message) {
    statusCode = error.statusCode;
    message = error.message;
  } else {
    message = "Server error";
  }

  send(res, statusCode, {
    success: false,
    message,
    ...(errors ? { errors } : {}),
  });
};

export const responseMap = {
  create: {
    code: 201,
    message: (entity: string) => `${entity} created successfully`,
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
    message: (entity: string) => `No ${entity} with this id`,
  },
  alreadyExist: {
    code: 409,
    message: (entity: string) => `Resource (${entity}) already exists`,
  },
  alreadyUsed: {
    code: 409,
    message: (entity: string) =>
      `Cannot delete ${entity}: still referenced by other entities`,
  },
  notFound: {
    code: 404,
    message: (entity: string) => `${entity} not found`,
  },
};
