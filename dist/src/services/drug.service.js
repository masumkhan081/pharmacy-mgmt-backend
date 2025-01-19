"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../config/constants");
const drug_model_1 = __importDefault(require("../models/drug.model"));
const queryHandler_1 = __importDefault(require("../utils/queryHandler"));
//
const createDrug = async (data) => await drug_model_1.default.create(data);
//
const getSingleDrug = async (id) => drug_model_1.default.findById(id);
//
const updateDrug = async ({ id, data }) => await drug_model_1.default.findByIdAndUpdate(id, data, { new: true });
//
const deleteDrug = async (id) => await drug_model_1.default.findByIdAndDelete(id);
//
async function getDrugs(query) {
    try {
        const { currentPage, viewLimit, viewSkip, sortBy, sortOrder, filterConditions, sortConditions, } = (0, queryHandler_1.default)({ query, entity: constants_1.entities.drug });
        const fetchResult = await drug_model_1.default.find(filterConditions)
            .sort(sortConditions)
            .skip(viewSkip)
            .limit(viewLimit);
        const total = await drug_model_1.default.countDocuments(filterConditions);
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
    createDrug,
    updateDrug,
    getSingleDrug,
    deleteDrug,
    getDrugs,
};
