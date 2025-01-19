"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePurchase = exports.updatePurchase = exports.createPurchase = exports.getSinglePurchase = exports.getPurchases = void 0;
const constants_1 = require("../config/constants");
const purchase_service_1 = __importDefault(require("../services/purchase.service"));
const responseHandler_1 = require("../utils/responseHandler");
//
const getPurchases = async (req, res) => {
    try {
        const result = await purchase_service_1.default.getPurchases(req.query);
        (0, responseHandler_1.sendFetchResponse)({ res, result, entity: constants_1.entities.purchase });
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
exports.getPurchases = getPurchases;
const getSinglePurchase = async (req, res) => {
    try {
        const result = await purchase_service_1.default.getSinglePurchase(req.params.id);
        (0, responseHandler_1.sendSingleFetchResponse)({ res, result, entity: constants_1.entities.purchase });
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
exports.getSinglePurchase = getSinglePurchase;
const createPurchase = async (req, res) => {
    try {
        const result = await purchase_service_1.default.createPurchase(req.body);
        (0, responseHandler_1.sendCreateResponse)({ res, result, entity: constants_1.entities.purchase });
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
exports.createPurchase = createPurchase;
const updatePurchase = async (req, res) => {
    try {
        const result = await purchase_service_1.default.updatePurchase({
            id: req.params.id,
            data: req.body,
        });
        (0, responseHandler_1.sendUpdateResponse)({ res, result, entity: constants_1.entities.purchase });
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
exports.updatePurchase = updatePurchase;
const deletePurchase = async (req, res) => {
    try {
        const result = await purchase_service_1.default.deletePurchase(req.params.id);
        (0, responseHandler_1.sendDeletionResponse)({ res, result, entity: constants_1.entities.purchase });
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
exports.deletePurchase = deletePurchase;
exports.default = {
    getPurchases: exports.getPurchases,
    getSinglePurchase: exports.getSinglePurchase,
    createPurchase: exports.createPurchase,
    updatePurchase: exports.updatePurchase,
    deletePurchase: exports.deletePurchase,
};
