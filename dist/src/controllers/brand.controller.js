"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBrand = exports.updateBrand = exports.createBrand = exports.getSingleBrand = exports.getBrands = void 0;
const constants_1 = require("../config/constants");
const brand_service_1 = __importDefault(require("../services/brand.service"));
const responseHandler_1 = require("../utils/responseHandler");
const mfr_model_1 = __importDefault(require("../models/mfr.model"));
const generic_model_1 = __importDefault(require("../models/generic.model"));
//
const getBrands = async (req, res) => {
    try {
        const result = await brand_service_1.default.getBrands(req.query);
        (0, responseHandler_1.sendFetchResponse)({ res, result, entity: constants_1.entities.brand });
    }
    catch (error) {
        console.error(error);
        (0, responseHandler_1.sendErrorResponse)({
            res,
            error,
            entity: constants_1.entities.brand,
        });
    }
};
exports.getBrands = getBrands;
const getSingleBrand = async (req, res) => {
    try {
        const result = await brand_service_1.default.getSingleBrand(req.params.id);
        (0, responseHandler_1.sendSingleFetchResponse)({ res, result, entity: constants_1.entities.brand });
    }
    catch (error) {
        console.error(error);
        (0, responseHandler_1.sendErrorResponse)({
            res,
            error,
            entity: constants_1.entities.brand,
        });
    }
};
exports.getSingleBrand = getSingleBrand;
const createBrand = async (req, res) => {
    try {
        const genericExists = await generic_model_1.default.findById(req.body.generic);
        if (!genericExists) {
            res.status(400).json({
                success: false,
                message: "Invalid generic reference"
            });
            return;
        }
        const manufacturerExists = await mfr_model_1.default.findById(req.body.manufacturer);
        if (!manufacturerExists) {
            res.status(400).json({
                success: false,
                message: "Invalid manufacturer reference"
            });
            return;
        }
        const result = await brand_service_1.default.createBrand(req.body);
        (0, responseHandler_1.sendCreateResponse)({ res, result, entity: constants_1.entities.brand });
    }
    catch (error) {
        console.error(error);
        (0, responseHandler_1.sendErrorResponse)({
            res,
            error,
            entity: constants_1.entities.brand,
        });
    }
};
exports.createBrand = createBrand;
// 
const updateBrand = async (req, res) => {
    try {
        if (req.body.generic && !(await generic_model_1.default.findById(req.body.generic))) {
            res.status(400).json({
                success: false,
                message: "Invalid generic reference",
            });
            return;
        }
        if (req.body.manufacturer && !(await generic_model_1.default.findById(req.body.manufacturer))) {
            res.status(400).json({
                success: false,
                message: "Invalid manufacturer reference",
            });
            return;
        }
        const result = await brand_service_1.default.updateBrand({
            id: req.params.id,
            data: req.body,
        });
        (0, responseHandler_1.sendUpdateResponse)({ res, result, entity: constants_1.entities.brand });
    }
    catch (error) {
        console.error(error);
        (0, responseHandler_1.sendErrorResponse)({
            res,
            error,
            entity: constants_1.entities.brand,
        });
    }
};
exports.updateBrand = updateBrand;
// 
const deleteBrand = async (req, res) => {
    try {
        const result = await brand_service_1.default.deleteBrand(req.params.id);
        (0, responseHandler_1.sendDeletionResponse)({ res, result, entity: constants_1.entities.brand });
    }
    catch (error) {
        console.error(error);
        (0, responseHandler_1.sendErrorResponse)({
            res,
            error,
            entity: constants_1.entities.brand,
        });
    }
};
exports.deleteBrand = deleteBrand;
exports.default = {
    getBrands: exports.getBrands,
    getSingleBrand: exports.getSingleBrand,
    createBrand: exports.createBrand,
    updateBrand: exports.updateBrand,
    deleteBrand: exports.deleteBrand,
};
