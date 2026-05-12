"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePurchase = exports.createPurchase = exports.getSinglePurchase = exports.getPurchases = void 0;
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
            entity: constants_1.entities.purchase,
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
            entity: constants_1.entities.purchase,
        });
    }
};
exports.getSinglePurchase = getSinglePurchase;
const createPurchase = async (req, res) => {
    try {
        const result = await purchase_service_1.default.createPurchase({
            ...req.body,
            actor: req.user?.id,
        });
        (0, responseHandler_1.sendCreateResponse)({ res, result, entity: constants_1.entities.purchase });
    }
    catch (error) {
        console.error(error);
        (0, responseHandler_1.sendErrorResponse)({ res, error, entity: constants_1.entities.purchase });
    }
};
exports.createPurchase = createPurchase;
const deletePurchase = async (req, res) => {
    try {
        const result = await purchase_service_1.default.deletePurchase({
            id: req.params.id,
            actor: req.user?.id,
        });
        (0, responseHandler_1.sendDeletionResponse)({ res, result, entity: constants_1.entities.purchase });
    }
    catch (error) {
        console.error(error);
        (0, responseHandler_1.sendErrorResponse)({ res, error, entity: constants_1.entities.purchase });
    }
};
exports.deletePurchase = deletePurchase;
exports.default = {
    getPurchases: exports.getPurchases,
    getSinglePurchase: exports.getSinglePurchase,
    createPurchase: exports.createPurchase,
    deletePurchase: exports.deletePurchase,
};
