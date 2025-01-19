"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAttendance = exports.updateAttendance = exports.createAttendance = exports.getSingleAttendance = exports.getAttendances = void 0;
const constants_1 = require("../config/constants");
const attendance_service_1 = __importDefault(require("../services/attendance.service"));
const responseHandler_1 = require("../utils/responseHandler");
//
const getAttendances = async (req, res) => {
    try {
        const result = await attendance_service_1.default.getAttendances(req.query);
        (0, responseHandler_1.sendFetchResponse)({ res, result, entity: constants_1.entities.attendance });
    }
    catch (error) {
        console.error(error);
        (0, responseHandler_1.sendErrorResponse)({
            res,
            error,
            entity: constants_1.entities.attendance,
        });
    }
};
exports.getAttendances = getAttendances;
const getSingleAttendance = async (req, res) => {
    try {
        const result = await attendance_service_1.default.getSingleAttendance(req.params.id);
        (0, responseHandler_1.sendSingleFetchResponse)({ res, result, entity: constants_1.entities.attendance });
    }
    catch (error) {
        console.error(error);
        (0, responseHandler_1.sendErrorResponse)({
            res,
            error,
            entity: constants_1.entities.attendance,
        });
    }
};
exports.getSingleAttendance = getSingleAttendance;
const createAttendance = async (req, res) => {
    try {
        const result = await attendance_service_1.default.createAttendance(req.body);
        (0, responseHandler_1.sendCreateResponse)({ res, result, entity: constants_1.entities.attendance });
    }
    catch (error) {
        console.error(error);
        (0, responseHandler_1.sendErrorResponse)({
            res,
            error,
            entity: constants_1.entities.attendance,
        });
    }
};
exports.createAttendance = createAttendance;
const updateAttendance = async (req, res) => {
    try {
        const result = await attendance_service_1.default.updateAttendance({
            id: req.params.id,
            data: req.body,
        });
        (0, responseHandler_1.sendUpdateResponse)({ res, result, entity: constants_1.entities.attendance });
    }
    catch (error) {
        console.error(error);
        (0, responseHandler_1.sendErrorResponse)({
            res,
            error,
            entity: constants_1.entities.attendance,
        });
    }
};
exports.updateAttendance = updateAttendance;
const deleteAttendance = async (req, res) => {
    try {
        const result = await attendance_service_1.default.deleteAttendance(req.params.id);
        (0, responseHandler_1.sendDeletionResponse)({ res, result, entity: constants_1.entities.attendance });
    }
    catch (error) {
        console.error(error);
        (0, responseHandler_1.sendErrorResponse)({
            res,
            error,
            entity: constants_1.entities.attendance,
        });
    }
};
exports.deleteAttendance = deleteAttendance;
exports.default = {
    getAttendances: exports.getAttendances,
    getSingleAttendance: exports.getSingleAttendance,
    createAttendance: exports.createAttendance,
    updateAttendance: exports.updateAttendance,
    deleteAttendance: exports.deleteAttendance,
};
