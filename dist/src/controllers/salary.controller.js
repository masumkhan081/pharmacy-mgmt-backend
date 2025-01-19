"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSalary = exports.updateSalary = exports.createSalary = exports.getSingleSalary = exports.getSalaries = void 0;
const constants_1 = require("../config/constants");
const salary_service_1 = __importDefault(require("../services/salary.service"));
const responseHandler_1 = require("../utils/responseHandler");
//
const getSalaries = async (req, res) => {
    try {
        const result = await salary_service_1.default.getSalaries(req.query);
        (0, responseHandler_1.sendFetchResponse)({ res, result, entity: constants_1.entities.salary });
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
exports.getSalaries = getSalaries;
const getSingleSalary = async (req, res) => {
    try {
        const result = await salary_service_1.default.getSingleSalary(req.params.id);
        (0, responseHandler_1.sendSingleFetchResponse)({ res, result, entity: constants_1.entities.salary });
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
exports.getSingleSalary = getSingleSalary;
const createSalary = async (req, res) => {
    try {
        const result = await salary_service_1.default.createSalary(req.body);
        (0, responseHandler_1.sendCreateResponse)({ res, result, entity: constants_1.entities.salary });
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
exports.createSalary = createSalary;
const updateSalary = async (req, res) => {
    try {
        const result = await salary_service_1.default.updateSalary({
            id: req.params.id,
            data: req.body,
        });
        (0, responseHandler_1.sendUpdateResponse)({ res, result, entity: constants_1.entities.salary });
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
exports.updateSalary = updateSalary;
// 
const deleteSalary = async (req, res) => {
    try {
        const result = await salary_service_1.default.deleteSalary(req.params.id);
        (0, responseHandler_1.sendDeletionResponse)({ res, result, entity: constants_1.entities.salary });
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
exports.deleteSalary = deleteSalary;
exports.default = {
    getSalaries: exports.getSalaries,
    getSingleSalary: exports.getSingleSalary,
    createSalary: exports.createSalary,
    updateSalary: exports.updateSalary,
    deleteSalary: exports.deleteSalary,
};
