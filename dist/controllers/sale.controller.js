"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSale = exports.createSale = exports.getSingleSale = exports.getSales = void 0;
const constants_1 = require("../config/constants");
const sale_service_1 = __importDefault(require("../services/sale.service"));
const responseHandler_1 = require("../utils/responseHandler");
//
const getSales = async (req, res) => {
    try {
        const result = await sale_service_1.default.getSales(req.query);
        (0, responseHandler_1.sendFetchResponse)({ res, result, entity: constants_1.entities.sale });
    }
    catch (error) {
        console.error(error);
        (0, responseHandler_1.sendErrorResponse)({
            res,
            error,
            entity: constants_1.entities.sale,
        });
    }
};
exports.getSales = getSales;
const getSingleSale = async (req, res) => {
    try {
        const result = await sale_service_1.default.getSingleSale(req.params.id);
        (0, responseHandler_1.sendSingleFetchResponse)({ res, result, entity: constants_1.entities.sale });
    }
    catch (error) {
        console.error(error);
        (0, responseHandler_1.sendErrorResponse)({
            res,
            error,
            entity: constants_1.entities.sale,
        });
    }
};
exports.getSingleSale = getSingleSale;
// 
const createSale = async (req, res) => {
    try {
        const result = await sale_service_1.default.createSale({
            ...req.body,
            actor: req.user?.id,
        });
        (0, responseHandler_1.sendCreateResponse)({ res, result, entity: constants_1.entities.sale });
    }
    catch (error) {
        console.error(error);
        (0, responseHandler_1.sendErrorResponse)({
            res,
            error,
            entity: constants_1.entities.sale,
        });
    }
};
exports.createSale = createSale;
// 
const deleteSale = async (req, res) => {
    try {
        const result = await sale_service_1.default.deleteSale({
            id: req.params.id,
            actor: req.user?.id,
        });
        (0, responseHandler_1.sendDeletionResponse)({ res, result, entity: constants_1.entities.sale });
    }
    catch (error) {
        console.error(error);
        (0, responseHandler_1.sendErrorResponse)({
            res,
            error,
            entity: constants_1.entities.sale,
        });
    }
};
exports.deleteSale = deleteSale;
exports.default = {
    getSales: exports.getSales,
    getSingleSale: exports.getSingleSale,
    createSale: exports.createSale,
    deleteSale: exports.deleteSale,
};
