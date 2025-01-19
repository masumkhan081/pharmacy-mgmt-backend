"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteManufacturer = exports.updateManufacturer = exports.createManufacturer = exports.getSingleManufacturer = exports.getManufacturers = void 0;
const constants_1 = require("../config/constants");
const mfr_service_1 = __importDefault(require("../services/mfr.service"));
const responseHandler_1 = require("../utils/responseHandler");
//
const getManufacturers = async (req, res) => {
    try {
        const result = await mfr_service_1.default.getManufacturers(req.query);
        (0, responseHandler_1.sendFetchResponse)({ res, result, entity: constants_1.entities.manufacturer });
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
exports.getManufacturers = getManufacturers;
const getSingleManufacturer = async (req, res) => {
    try {
        const result = await mfr_service_1.default.getSingleManufacturer(req.params.id);
        (0, responseHandler_1.sendSingleFetchResponse)({ res, result, entity: constants_1.entities.manufacturer });
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
exports.getSingleManufacturer = getSingleManufacturer;
const createManufacturer = async (req, res) => {
    try {
        const result = await mfr_service_1.default.createManufacturer(req.body);
        (0, responseHandler_1.sendCreateResponse)({ res, result, entity: constants_1.entities.manufacturer });
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
exports.createManufacturer = createManufacturer;
const updateManufacturer = async (req, res) => {
    try {
        const result = await mfr_service_1.default.updateManufacturer({
            id: req.params.id,
            data: req.body,
        });
        (0, responseHandler_1.sendUpdateResponse)({ res, result, entity: constants_1.entities.manufacturer });
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
exports.updateManufacturer = updateManufacturer;
const deleteManufacturer = async (req, res) => {
    try {
        const result = await mfr_service_1.default.deleteManufacturer(req.params.id);
        (0, responseHandler_1.sendDeletionResponse)({ res, result, entity: constants_1.entities.manufacturer });
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
exports.deleteManufacturer = deleteManufacturer;
exports.default = {
    getManufacturers: exports.getManufacturers,
    getSingleManufacturer: exports.getSingleManufacturer,
    createManufacturer: exports.createManufacturer,
    updateManufacturer: exports.updateManufacturer,
    deleteManufacturer: exports.deleteManufacturer,
};
