"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../config/constants");
const formulation_model_1 = __importDefault(require("../models/formulation.model"));
const queryHandler_1 = __importDefault(require("../utils/queryHandler"));
//
const createFormulation = async (data) => await formulation_model_1.default.create(data);
//
const getSingleFormulation = async (id) => formulation_model_1.default.findById(id);
//
const updateFormulation = async ({ id, data }) => await formulation_model_1.default.findByIdAndUpdate(id, data, { new: true });
//
const deleteFormulation = async (id) => await formulation_model_1.default.findByIdAndDelete(id);
//
async function getFormulations(query) {
    try {
        const { currentPage, viewLimit, viewSkip, sortBy, sortOrder, filterConditions, sortConditions, } = (0, queryHandler_1.default)({ query, entity: constants_1.entities.formulation });
        const fetchResult = await formulation_model_1.default.find(filterConditions)
            .sort(sortConditions)
            .skip(viewSkip)
            .limit(viewLimit);
        const total = await formulation_model_1.default.countDocuments(filterConditions);
        return {
            meta: {
                total,
                limit: viewLimit,
                page: currentPage,
                skip: viewSkip,
                sortBy,
                sortOrder,
            },
            data: fetchResult,
        };
    }
    catch (error) {
        return error;
    }
}
exports.default = {
    createFormulation,
    updateFormulation,
    getSingleFormulation,
    deleteFormulation,
    getFormulations,
};
