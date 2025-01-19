"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSalary = exports.createSalary = void 0;
const constants_1 = require("../config/constants");
const salary_model_1 = __importDefault(require("../models/salary.model"));
const queryHandler_1 = __importDefault(require("../utils/queryHandler"));
//
const getSingleSalary = async (id) => salary_model_1.default.findById(id);
const deleteSalary = async (id) => await salary_model_1.default.findByIdAndDelete(id);
// 
const createSalary = async (data) => await salary_model_1.default.create(data);
exports.createSalary = createSalary;
// 
const updateSalary = async ({ id, data }) => await salary_model_1.default.findByIdAndUpdate(id, data, { new: true });
exports.updateSalary = updateSalary;
// 
async function getSalaries(query) {
    try {
        const { currentPage, viewLimit, viewSkip, sortBy, sortOrder, filterConditions, sortConditions, } = (0, queryHandler_1.default)({ query, entity: constants_1.entities.salary });
        const fetchResult = await salary_model_1.default.find(filterConditions)
            .sort(sortConditions)
            .skip(viewSkip)
            .limit(viewLimit);
        const total = await salary_model_1.default.countDocuments(filterConditions);
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
    getSalaries,
    getSingleSalary,
    createSalary: exports.createSalary,
    updateSalary: exports.updateSalary,
    deleteSalary,
};
