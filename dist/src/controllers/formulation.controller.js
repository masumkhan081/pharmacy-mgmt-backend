"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFormulation = exports.updateFormulation = exports.createFormulation = exports.getSingleFormulation = exports.getFormulations = void 0;
const constants_1 = require("../config/constants");
const formulation_service_1 = __importDefault(require("../services/formulation.service"));
const responseHandler_1 = require("../utils/responseHandler");
//
const getFormulations = async (req, res) => {
    try {
        const result = await formulation_service_1.default.getFormulations(req.query);
        (0, responseHandler_1.sendFetchResponse)({ res, result, entity: constants_1.entities.formulation });
    }
    catch (error) {
        console.error(error);
        (0, responseHandler_1.sendErrorResponse)({
            res,
            error,
            entity: constants_1.entities.formulation,
        });
    }
};
exports.getFormulations = getFormulations;
const getSingleFormulation = async (req, res) => {
    try {
        const result = await formulation_service_1.default.getSingleFormulation(req.params.id);
        (0, responseHandler_1.sendSingleFetchResponse)({ res, result, entity: constants_1.entities.formulation });
    }
    catch (error) {
        console.error(error);
        (0, responseHandler_1.sendErrorResponse)({
            res,
            error,
            entity: constants_1.entities.formulation,
        });
    }
};
exports.getSingleFormulation = getSingleFormulation;
const createFormulation = async (req, res) => {
    try {
        const result = await formulation_service_1.default.createFormulation(req.body);
        (0, responseHandler_1.sendCreateResponse)({ res, result, entity: constants_1.entities.formulation });
    }
    catch (error) {
        console.error(error);
        (0, responseHandler_1.sendErrorResponse)({
            res,
            error,
            entity: constants_1.entities.formulation,
        });
    }
};
exports.createFormulation = createFormulation;
const updateFormulation = async (req, res) => {
    try {
        const result = await formulation_service_1.default.updateFormulation({
            id: req.params.id,
            data: req.body,
        });
        (0, responseHandler_1.sendUpdateResponse)({ res, result, entity: constants_1.entities.formulation });
    }
    catch (error) {
        console.error(error);
        (0, responseHandler_1.sendErrorResponse)({
            res,
            error,
            entity: constants_1.entities.formulation,
        });
    }
};
exports.updateFormulation = updateFormulation;
// 
const deleteFormulation = async (req, res) => {
    try {
        const result = await formulation_service_1.default.deleteFormulation(req.params.id);
        (0, responseHandler_1.sendDeletionResponse)({ res, result, entity: constants_1.entities.formulation });
    }
    catch (error) {
        console.error(error);
        (0, responseHandler_1.sendErrorResponse)({
            res,
            error,
            entity: constants_1.entities.formulation,
        });
    }
};
exports.deleteFormulation = deleteFormulation;
exports.default = {
    getFormulations: exports.getFormulations,
    getSingleFormulation: exports.getSingleFormulation,
    createFormulation: exports.createFormulation,
    updateFormulation: exports.updateFormulation,
    deleteFormulation: exports.deleteFormulation,
};
