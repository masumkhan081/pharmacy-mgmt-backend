"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSupplier = exports.updateSupplier = exports.createSupplier = exports.getSingleSupplier = exports.getSuppliers = void 0;
const constants_1 = require("../config/constants");
const supplier_service_1 = __importDefault(require("../services/supplier.service"));
const responseHandler_1 = require("../utils/responseHandler");
//
const getSuppliers = async (req, res) => {
    try {
        const result = await supplier_service_1.default.getSuppliers(req.query);
        (0, responseHandler_1.sendFetchResponse)({ res, result, entity: constants_1.entities.supplier });
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
exports.getSuppliers = getSuppliers;
const getSingleSupplier = async (req, res) => {
    try {
        const result = await supplier_service_1.default.getSingleSupplier(req.params.id);
        (0, responseHandler_1.sendSingleFetchResponse)({ res, result, entity: constants_1.entities.supplier });
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
exports.getSingleSupplier = getSingleSupplier;
const createSupplier = async (req, res) => {
    try {
        const result = await supplier_service_1.default.createSupplier(req.body);
        (0, responseHandler_1.sendCreateResponse)({ res, result, entity: constants_1.entities.supplier });
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
exports.createSupplier = createSupplier;
const updateSupplier = async (req, res) => {
    try {
        const result = await supplier_service_1.default.updateSupplier({
            id: req.params.id,
            data: req.body,
        });
        (0, responseHandler_1.sendUpdateResponse)({ res, result, entity: constants_1.entities.supplier });
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
exports.updateSupplier = updateSupplier;
const deleteSupplier = async (req, res) => {
    try {
        const result = await supplier_service_1.default.deleteSupplier(req.params.id);
        (0, responseHandler_1.sendDeletionResponse)({ res, result, entity: constants_1.entities.supplier });
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
exports.deleteSupplier = deleteSupplier;
