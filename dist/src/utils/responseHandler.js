"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseMap = exports.sendErrorResponse = exports.sendFetchResponse = exports.sendSingleFetchResponse = void 0;
exports.sendCreateResponse = sendCreateResponse;
exports.sendUpdateResponse = sendUpdateResponse;
exports.sendDeletionResponse = sendDeletionResponse;
//
const sendSingleFetchResponse = ({ res, result, entity, }) => {
    const statusCode = result
        ? exports.responseMap.fetch.code
        : exports.responseMap.notFound.code;
    res.status(statusCode).json({
        statusCode,
        success: result ? true : false,
        message: result
            ? exports.responseMap.fetch.message(entity)
            : exports.responseMap.idNotFound.message(entity),
        data: result,
    });
};
exports.sendSingleFetchResponse = sendSingleFetchResponse;
//
const sendFetchResponse = ({ res, result, entity, }) => {
    if (result instanceof Error) {
        return (0, exports.sendErrorResponse)({
            res,
            error: result,
            entity,
        });
    }
    const statusCode = exports.responseMap.fetch.code;
    res.status(statusCode).json({
        statusCode,
        success: true,
        message: exports.responseMap.fetch.message(entity),
        data: result,
    });
};
exports.sendFetchResponse = sendFetchResponse;
// 
function sendCreateResponse({ res, result, entity }) {
    const statusCode = exports.responseMap.create.code;
    res.status(statusCode).json({
        statusCode,
        success: true,
        message: exports.responseMap.create.message(entity),
        result,
    });
}
function sendUpdateResponse({ res, result, entity }) {
    const { update, notFound, idNotFound } = exports.responseMap;
    const isSuccess = Boolean(result);
    const statusCode = isSuccess ? update.code : notFound.code;
    res.status(statusCode).json({
        statusCode,
        success: isSuccess,
        message: isSuccess ? update.message(entity) : idNotFound.message(entity),
        result,
    });
}
function sendDeletionResponse({ res, result, entity }) {
    const statusCode = result ? exports.responseMap.delete.code : exports.responseMap.notFound.code;
    res.status(statusCode).json({
        statusCode,
        success: result ? true : false,
        message: result
            ? exports.responseMap.delete.message(entity)
            : exports.responseMap.idNotFound.message(entity),
        result,
    });
}
const sendErrorResponse = ({ res, error, entity, }) => {
    let statusCode = 500;
    let message = "An unexpected error occurred";
    const messages = {};
    let type = "unknown-error";
    console.error("sendErrorResponse:", error.message);
    if (error?.name == "ValidationError") {
        statusCode = 400;
        message = "Invalid data";
        type = "validation-error";
        for (const [field, errorDetail] of Object.entries(error.errors)) {
            messages[field] = errorDetail.message;
        }
    }
    else if (error?.code === 11000) {
        statusCode = 409;
        message = "Duplicate key error";
        type = "duplicate-key-error";
    }
    else if (error?.code === 404) {
        statusCode = 404;
        message = `Resource not found: ${entity}`;
        type = "not-found-error";
    }
    else if (error?.code === 409) {
        statusCode = 409;
        message = "Conflict error";
        type = "conflict-error";
    }
    else {
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
exports.sendErrorResponse = sendErrorResponse;
exports.responseMap = {
    create: {
        code: 201,
        message: (entity) => `${entity}  created successfully`,
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
        message: (entity) => `No resource (${entity}) with this ID.`,
    },
    alreadyExist: {
        code: 409, // Error code for "conflict" or "Already Exists" as mongodb return
        message: (entity) => `Resource (${entity}) already exists`,
    },
    alreadyUsed: {
        code: 409, // HTTP status code for "Conflict"
        message: (entity) => `Cannot delete ${entity}: Resource is already used by other entities`,
    },
    //
    invalid: { code: 500, message: "Invalid Request" },
    badRequest: { code: 500, message: "Bad Request" },
    notFound: { code: 404, message: (entity) => `${entity} not found` },
    serverError: { code: 500, message: "Internal Server Error" },
    somethingWentWrong: { code: 500, message: "Something went wrong" },
    unauthorized: { code: 500, message: "Unauthorized Access" },
    forbidden: { code: 500, message: "Forbidden Access" },
    noData: { code: 204, message: `No Data` },
    failInUpdate: {
        code: 1000,
        message: (entity) => `${entity} failed to update`,
    },
    //
    creationFailed: { code: 400, message: "Creation failed" },
};
