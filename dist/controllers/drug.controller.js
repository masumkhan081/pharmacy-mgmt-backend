"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDrug = exports.updateDrug = exports.createDrug = exports.getSingleDrug = exports.getDrugs = void 0;
const constants_1 = require("../config/constants");
const drug_service_1 = __importDefault(require("../services/drug.service"));
const responseHandler_1 = require("../utils/responseHandler");
//
const getDrugs = async (req, res) => {
    try {
        const result = await drug_service_1.default.getDrugs(req.query);
        (0, responseHandler_1.sendFetchResponse)({ res, result, entity: constants_1.entities.drug });
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
exports.getDrugs = getDrugs;
const getSingleDrug = async (req, res) => {
    try {
        const result = await drug_service_1.default.getSingleDrug(req.params.id);
        (0, responseHandler_1.sendSingleFetchResponse)({ res, result, entity: constants_1.entities.drug });
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
exports.getSingleDrug = getSingleDrug;
const createDrug = async (req, res) => {
    try {
        const result = await drug_service_1.default.createDrug(req.body);
        (0, responseHandler_1.sendCreateResponse)({ res, result, entity: constants_1.entities.drug });
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
exports.createDrug = createDrug;
const updateDrug = async (req, res) => {
    try {
        const result = await drug_service_1.default.updateDrug({
            id: req.params.id,
            data: req.body,
        });
        (0, responseHandler_1.sendUpdateResponse)({ res, result, entity: constants_1.entities.drug });
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
exports.updateDrug = updateDrug;
const deleteDrug = async (req, res) => {
    try {
        const result = await drug_service_1.default.deleteDrug(req.params.id);
        (0, responseHandler_1.sendDeletionResponse)({ res, result, entity: constants_1.entities.drug });
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
exports.deleteDrug = deleteDrug;
exports.default = {
    getDrugs: exports.getDrugs,
    getSingleDrug: exports.getSingleDrug,
    createDrug: exports.createDrug,
    updateDrug: exports.updateDrug,
    deleteDrug: exports.deleteDrug,
};
