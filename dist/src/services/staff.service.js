"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../config/constants");
const staff_model_1 = __importDefault(require("../models/staff.model"));
const queryHandler_1 = __importDefault(require("../utils/queryHandler"));
//
const createStaff = async (data) => await staff_model_1.default.create(data);
//
const getSingleStaff = async (id) => staff_model_1.default.findById(id);
//
const updateStaff = async ({ id, data }) => await staff_model_1.default.findByIdAndUpdate(id, data, { new: true });
//
const deleteStaff = async (id) => await staff_model_1.default.findByIdAndDelete(id);
//
async function getStaffs(query) {
    try {
        const { currentPage, viewLimit, viewSkip, sortBy, sortOrder, filterConditions, sortConditions, } = (0, queryHandler_1.default)({ query, entity: constants_1.entities.unit });
        const fetchResult = await staff_model_1.default.find(filterConditions)
            .sort(sortConditions)
            .skip(viewSkip)
            .limit(viewLimit);
        const total = await staff_model_1.default.countDocuments(filterConditions);
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
    createStaff,
    updateStaff,
    getSingleStaff,
    deleteStaff,
    getStaffs,
};
