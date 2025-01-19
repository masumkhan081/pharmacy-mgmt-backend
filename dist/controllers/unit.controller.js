"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUnit = exports.updateUnit = exports.createUnit = exports.getSingleUnit = exports.getUnits = void 0;
const constants_1 = require("../config/constants");
const unit_service_1 = __importDefault(require("../services/unit.service"));
const responseHandler_1 = require("../utils/responseHandler");
//
const getUnits = async (req, res) => {
    try {
        const result = await unit_service_1.default.getUnits(req.query);
        (0, responseHandler_1.sendFetchResponse)({ res, result, entity: constants_1.entities.unit });
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
exports.getUnits = getUnits;
const getSingleUnit = async (req, res) => {
    try {
        const result = await unit_service_1.default.getSingleUnit(req.params.id);
        (0, responseHandler_1.sendSingleFetchResponse)({ res, result, entity: constants_1.entities.unit });
    }
    catch (error) {
        // console.error("Error fetching unit:", error);
        (0, responseHandler_1.sendErrorResponse)({ res, error, entity: constants_1.entities.unit });
    }
};
exports.getSingleUnit = getSingleUnit;
const createUnit = async (req, res) => {
    try {
        const result = await unit_service_1.default.createUnit(req.body);
        (0, responseHandler_1.sendCreateResponse)({ res, result, entity: constants_1.entities.unit });
    }
    catch (error) {
        console.error(error instanceof Error ? error.message : "Unknown error");
        (0, responseHandler_1.sendErrorResponse)({
            res,
            error,
            entity: constants_1.entities.unit,
        });
    }
};
exports.createUnit = createUnit;
const updateUnit = async (req, res) => {
    try {
        const result = await unit_service_1.default.updateUnit({
            id: req.params.id,
            data: req.body,
        });
        (0, responseHandler_1.sendUpdateResponse)({ res, result, entity: constants_1.entities.unit });
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
exports.updateUnit = updateUnit;
const deleteUnit = async (req, res) => {
    try {
        const result = await unit_service_1.default.deleteUnit(req.params.id);
        (0, responseHandler_1.sendDeletionResponse)({ res, result, entity: constants_1.entities.unit });
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
exports.deleteUnit = deleteUnit;
