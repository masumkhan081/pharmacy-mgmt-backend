"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../config/constants");
const group_model_1 = __importDefault(require("../models/group.model"));
const queryHandler_1 = __importDefault(require("../utils/queryHandler"));
//
const createGroup = async (data) => await group_model_1.default.create(data);
//
const getSingleGroup = async (id) => group_model_1.default.findById(id);
//
const updateGroup = async ({ id, data }) => await group_model_1.default.findByIdAndUpdate(id, data, { new: true });
//
const deleteGroup = async (id) => await group_model_1.default.findByIdAndDelete(id);
//
async function getGroups(query) {
    try {
        const { currentPage, viewLimit, viewSkip, sortBy, sortOrder, filterConditions, sortConditions, } = (0, queryHandler_1.default)({ query, entity: constants_1.entities.group });
        const fetchResult = await group_model_1.default.find(filterConditions)
            .sort(sortConditions)
            .skip(viewSkip)
            .limit(viewLimit);
        const total = await group_model_1.default.countDocuments(filterConditions);
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
    createGroup,
    updateGroup,
    getSingleGroup,
    deleteGroup,
    getGroups,
};
