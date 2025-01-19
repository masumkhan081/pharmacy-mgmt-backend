"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGroup = exports.updateGroup = exports.createGroup = exports.getSingleGroup = exports.getGroups = void 0;
const constants_1 = require("../config/constants");
const group_service_1 = __importDefault(require("../services/group.service"));
const responseHandler_1 = require("../utils/responseHandler");
//
const getGroups = async (req, res) => {
    try {
        const result = await group_service_1.default.getGroups(req.query);
        (0, responseHandler_1.sendFetchResponse)({ res, result, entity: constants_1.entities.group });
    }
    catch (error) {
        console.error(error);
        (0, responseHandler_1.sendErrorResponse)({
            res,
            error,
            entity: constants_1.entities.unit,
        });
    }
};
exports.getGroups = getGroups;
const getSingleGroup = async (req, res) => {
    try {
        const result = await group_service_1.default.getSingleGroup(req.params.id);
        (0, responseHandler_1.sendSingleFetchResponse)({ res, result, entity: constants_1.entities.group });
    }
    catch (error) {
        console.error(error);
        (0, responseHandler_1.sendErrorResponse)({
            res,
            error,
            entity: constants_1.entities.unit,
        });
    }
};
exports.getSingleGroup = getSingleGroup;
const createGroup = async (req, res) => {
    try {
        const result = await group_service_1.default.createGroup(req.body);
        (0, responseHandler_1.sendCreateResponse)({ res, result, entity: constants_1.entities.group });
    }
    catch (error) {
        console.error(error);
        (0, responseHandler_1.sendErrorResponse)({
            res,
            error,
            entity: constants_1.entities.unit,
        });
    }
};
exports.createGroup = createGroup;
const updateGroup = async (req, res) => {
    try {
        const result = await group_service_1.default.updateGroup({
            id: req.params.id,
            data: req.body,
        });
        (0, responseHandler_1.sendUpdateResponse)({ res, result, entity: constants_1.entities.group });
    }
    catch (error) {
        console.error(error);
        (0, responseHandler_1.sendErrorResponse)({
            res,
            error,
            entity: constants_1.entities.unit,
        });
    }
};
exports.updateGroup = updateGroup;
const deleteGroup = async (req, res) => {
    try {
        const result = await group_service_1.default.deleteGroup(req.params.id);
        (0, responseHandler_1.sendDeletionResponse)({ res, result, entity: constants_1.entities.group });
    }
    catch (error) {
        console.error(error);
        (0, responseHandler_1.sendErrorResponse)({
            res,
            error,
            entity: constants_1.entities.unit,
        });
    }
};
exports.deleteGroup = deleteGroup;
exports.default = {
    getGroups: exports.getGroups,
    getSingleGroup: exports.getSingleGroup,
    createGroup: exports.createGroup,
    updateGroup: exports.updateGroup,
    deleteGroup: exports.deleteGroup,
};
