"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../config/constants");
const generic_model_1 = __importDefault(require("../models/generic.model"));
const queryHandler_1 = __importDefault(require("../utils/queryHandler"));
//
const createGeneric = async (data) => await generic_model_1.default.create(data);
//
const getSingleGeneric = async (id) => generic_model_1.default.findById(id);
//
const updateGeneric = async ({ id, data }) => await generic_model_1.default.findByIdAndUpdate(id, data, { new: true });
//
const deleteGeneric = async (id) => await generic_model_1.default.findByIdAndDelete(id);
//
async function getGenerics(query) {
    try {
        const { currentPage, viewLimit, viewSkip, sortBy, sortOrder, filterConditions, sortConditions, } = (0, queryHandler_1.default)({ query, entity: constants_1.entities.generic });
        const fetchResult = await generic_model_1.default.find(filterConditions)
            .sort(sortConditions)
            .skip(viewSkip)
            .limit(viewLimit);
        const total = await generic_model_1.default.countDocuments(filterConditions);
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
    createGeneric,
    updateGeneric,
    getSingleGeneric,
    deleteGeneric,
    getGenerics,
};
