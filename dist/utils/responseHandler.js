"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseMap = exports.sendErrorResponse = exports.sendForbidden = exports.sendUnauthorized = exports.sendConflict = exports.sendNotFound = exports.sendBadRequest = exports.sendDeletionResponse = exports.sendUpdateResponse = exports.sendCreateResponse = exports.sendListResponse = exports.sendSingleFetchResponse = exports.sendFetchResponse = void 0;
const send = (res, statusCode, body) => {
    res.status(statusCode).json({ statusCode, ...body });
};
const isPaginatedListShape = (value) => {
    return (typeof value === "object" &&
        value !== null &&
        "meta" in value &&
        "data" in value);
};
const sendFetchResponse = ({ res, result, entity, }) => {
    if (result instanceof Error) {
        return (0, exports.sendErrorResponse)({ res, error: result, entity });
    }
    if (isPaginatedListShape(result)) {
        return send(res, exports.responseMap.fetch.code, {
            success: true,
            message: exports.responseMap.fetch.message(entity),
            data: result.data,
            meta: { pagination: result.meta },
        });
    }
    send(res, exports.responseMap.fetch.code, {
        success: true,
        message: exports.responseMap.fetch.message(entity),
        data: result,
    });
};
exports.sendFetchResponse = sendFetchResponse;
const sendSingleFetchResponse = ({ res, result, entity, }) => {
    if (!result) {
        return (0, exports.sendNotFound)({
            res,
            message: exports.responseMap.idNotFound.message(entity),
        });
    }
    send(res, exports.responseMap.fetch.code, {
        success: true,
        message: exports.responseMap.fetch.message(entity),
        data: result,
    });
};
exports.sendSingleFetchResponse = sendSingleFetchResponse;
const sendListResponse = ({ res, result, entity, pagination, }) => {
    send(res, exports.responseMap.fetch.code, {
        success: true,
        message: exports.responseMap.fetch.message(entity),
        data: result,
        ...(pagination ? { meta: { pagination } } : {}),
    });
};
exports.sendListResponse = sendListResponse;
const sendCreateResponse = ({ res, result, entity, }) => {
    send(res, exports.responseMap.create.code, {
        success: true,
        message: exports.responseMap.create.message(entity),
        data: result,
    });
};
exports.sendCreateResponse = sendCreateResponse;
const sendUpdateResponse = ({ res, result, entity, }) => {
    if (!result) {
        return (0, exports.sendNotFound)({
            res,
            message: exports.responseMap.idNotFound.message(entity),
        });
    }
    send(res, exports.responseMap.update.code, {
        success: true,
        message: exports.responseMap.update.message(entity),
        data: result,
    });
};
exports.sendUpdateResponse = sendUpdateResponse;
const sendDeletionResponse = ({ res, result, entity, }) => {
    if (!result) {
        return (0, exports.sendNotFound)({
            res,
            message: exports.responseMap.idNotFound.message(entity),
        });
    }
    send(res, exports.responseMap.delete.code, {
        success: true,
        message: exports.responseMap.delete.message(entity),
        data: result,
    });
};
exports.sendDeletionResponse = sendDeletionResponse;
const sendBadRequest = ({ res, message, errors, }) => {
    send(res, 400, {
        success: false,
        message,
        ...(errors ? { errors } : {}),
    });
};
exports.sendBadRequest = sendBadRequest;
const sendNotFound = ({ res, message, errors }) => {
    send(res, 404, {
        success: false,
        message,
        ...(errors ? { errors } : {}),
    });
};
exports.sendNotFound = sendNotFound;
const sendConflict = ({ res, message, errors }) => {
    send(res, 409, {
        success: false,
        message,
        ...(errors ? { errors } : {}),
    });
};
exports.sendConflict = sendConflict;
const sendUnauthorized = ({ res, message, errors, }) => {
    send(res, 401, {
        success: false,
        message,
        ...(errors ? { errors } : {}),
    });
};
exports.sendUnauthorized = sendUnauthorized;
const sendForbidden = ({ res, message, errors, }) => {
    send(res, 403, {
        success: false,
        message,
        ...(errors ? { errors } : {}),
    });
};
exports.sendForbidden = sendForbidden;
const sendErrorResponse = ({ res, error, entity, }) => {
    let statusCode = 500;
    let message = "An unexpected error occurred";
    let errors;
    console.error("sendErrorResponse:", error?.message ?? error);
    if (error?.name === "ValidationError") {
        statusCode = 400;
        message = "Invalid data";
        errors = Object.entries(error.errors).map(([field, detail]) => ({ field, message: detail.message }));
    }
    else if (error?.code === 11000) {
        statusCode = 409;
        message = entity
            ? `Resource (${entity}) already exists`
            : "Duplicate key error";
    }
    else if (error?.statusCode && error?.message) {
        statusCode = error.statusCode;
        message = error.message;
    }
    else {
        message = "Server error";
    }
    send(res, statusCode, {
        success: false,
        message,
        ...(errors ? { errors } : {}),
    });
};
exports.sendErrorResponse = sendErrorResponse;
exports.responseMap = {
    create: {
        code: 201,
        message: (entity) => `${entity} created successfully`,
    },
    delete: {
        code: 200,
        message: (entity) => `${entity} deleted successfully`,
    },
    update: {
        code: 200,
        message: (entity) => `${entity} updated successfully`,
    },
    fetch: {
        code: 200,
        message: (entity) => `${entity} fetched successfully`,
    },
    idNotFound: {
        code: 404,
        message: (entity) => `No ${entity} with this id`,
    },
    alreadyExist: {
        code: 409,
        message: (entity) => `Resource (${entity}) already exists`,
    },
    alreadyUsed: {
        code: 409,
        message: (entity) => `Cannot delete ${entity}: still referenced by other entities`,
    },
    notFound: {
        code: 404,
        message: (entity) => `${entity} not found`,
    },
};
