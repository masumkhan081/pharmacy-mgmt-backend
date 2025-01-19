"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGeneric = exports.updateGeneric = exports.createGeneric = exports.getSingleGeneric = exports.getGenerics = void 0;
const constants_1 = require("../config/constants");
const generic_service_1 = __importDefault(require("../services/generic.service"));
const responseHandler_1 = require("../utils/responseHandler");
const group_model_1 = __importDefault(require("../models/group.model"));
//
const getGenerics = async (req, res) => {
    try {
        const result = await generic_service_1.default.getGenerics(req.query);
        (0, responseHandler_1.sendFetchResponse)({ res, result, entity: constants_1.entities.generic });
    }
    catch (error) {
        console.error(error);
        // sendErrorResponse({
        //   res,
        //   error,
        //   entity: entities.unit,
        // });
    }
};
exports.getGenerics = getGenerics;
const getSingleGeneric = async (req, res) => {
    try {
        const result = await generic_service_1.default.getSingleGeneric(req.params.id);
        (0, responseHandler_1.sendSingleFetchResponse)({ res, result, entity: constants_1.entities.generic });
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
exports.getSingleGeneric = getSingleGeneric;
// 
const createGeneric = async (req, res) => {
    try {
        const group = await group_model_1.default.findById(req.body.group);
        if (!group) {
            res.status(400).json({
                success: false,
                message: "Group doesn't exist"
            });
            return;
        }
        const result = await generic_service_1.default.createGeneric(req.body);
        (0, responseHandler_1.sendCreateResponse)({ res, result, entity: constants_1.entities.generic });
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
exports.createGeneric = createGeneric;
// 
const updateGeneric = async (req, res) => {
    try {
        if (req.body.group && !(await group_model_1.default.findById(req.body.group))) {
            res.status(400).json({
                success: false,
                message: "Group doesn't exist",
            });
            return;
        }
        const result = await generic_service_1.default.updateGeneric({
            id: req.params.id,
            data: req.body,
        });
        (0, responseHandler_1.sendUpdateResponse)({ res, result, entity: constants_1.entities.generic });
    }
    catch (error) {
        console.log(`--log-- ` + JSON.stringify(error));
        (0, responseHandler_1.sendErrorResponse)({
            res,
            error,
            entity: constants_1.entities.unit,
        });
    }
};
exports.updateGeneric = updateGeneric;
// 
const deleteGeneric = async (req, res) => {
    try {
        const result = await generic_service_1.default.deleteGeneric(req.params.id);
        (0, responseHandler_1.sendDeletionResponse)({ res, result, entity: constants_1.entities.generic });
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
exports.deleteGeneric = deleteGeneric;
// 
exports.default = {
    getGenerics: exports.getGenerics,
    getSingleGeneric: exports.getSingleGeneric,
    createGeneric: exports.createGeneric,
    updateGeneric: exports.updateGeneric,
    deleteGeneric: exports.deleteGeneric,
};
