"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../config/constants");
const unit_model_1 = __importDefault(require("../models/unit.model"));
const queryHandler_1 = __importDefault(require("../utils/queryHandler"));
//
const createUnit = async (data) => await unit_model_1.default.create(data);
//
const getSingleUnit = async (id) => unit_model_1.default.findById(id);
//
const updateUnit = async ({ id, data }) => await unit_model_1.default.findByIdAndUpdate(id, data, { new: true });
//
const deleteUnit = async (id) => await unit_model_1.default.findByIdAndDelete(id);
//
async function getUnits(query) {
    try {
        const { currentPage, viewLimit, viewSkip, sortBy, sortOrder, filterConditions, sortConditions, } = (0, queryHandler_1.default)({ query, entity: constants_1.entities.unit });
        const fetchResult = await unit_model_1.default.find(filterConditions)
            .sort(sortConditions)
            .skip(viewSkip)
            .limit(viewLimit);
        const total = await unit_model_1.default.countDocuments(filterConditions);
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
    createUnit,
    updateUnit,
    getSingleUnit,
    deleteUnit,
    getUnits,
};
