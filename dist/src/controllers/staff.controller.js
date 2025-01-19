"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStaff = exports.updateStaff = exports.getSingleStaff = exports.getStaffs = exports.createStaff = void 0;
const constants_1 = require("../config/constants");
const staff_service_1 = __importDefault(require("../services/staff.service"));
const responseHandler_1 = require("../utils/responseHandler");
//
const createStaff = async (req, res) => {
    try {
        const result = await staff_service_1.default.createStaff(req.body);
        (0, responseHandler_1.sendCreateResponse)({ res, result, entity: constants_1.entities.staff });
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
exports.createStaff = createStaff;
const getStaffs = async (req, res) => {
    try {
        const result = await staff_service_1.default.getStaffs(req.query);
        (0, responseHandler_1.sendFetchResponse)({ res, result, entity: constants_1.entities.staff });
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
exports.getStaffs = getStaffs;
const getSingleStaff = async (req, res) => {
    try {
        const result = await staff_service_1.default.getSingleStaff(req.params.id);
        (0, responseHandler_1.sendSingleFetchResponse)({ res, result, entity: constants_1.entities.staff });
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
exports.getSingleStaff = getSingleStaff;
const updateStaff = async (req, res) => {
    try {
        const result = await staff_service_1.default.updateStaff({
            id: req.params.id,
            data: req.body,
        });
        (0, responseHandler_1.sendUpdateResponse)({ res, result, entity: constants_1.entities.staff });
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
exports.updateStaff = updateStaff;
const deleteStaff = async (req, res) => {
    try {
        const result = await staff_service_1.default.deleteStaff(req.params.id);
        (0, responseHandler_1.sendDeletionResponse)({ res, result, entity: constants_1.entities.staff });
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
exports.deleteStaff = deleteStaff;
exports.default = {
    getStaffs: exports.getStaffs,
    getSingleStaff: exports.getSingleStaff,
    createStaff: exports.createStaff,
    updateStaff: exports.updateStaff,
    deleteStaff: exports.deleteStaff,
};
