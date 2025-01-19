"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSale = void 0;
const constants_1 = require("../config/constants");
const sale_model_1 = __importDefault(require("../models/sale.model"));
const queryHandler_1 = __importDefault(require("../utils/queryHandler"));
//
const getSingleSale = async (id) => sale_model_1.default.findById(id);
//
const updateSale = async ({ id, data }) => await sale_model_1.default.findByIdAndUpdate(id, data, { new: true });
//
const deleteSale = async (id) => await sale_model_1.default.findByIdAndDelete(id);
// 
const createSale = async (data) => await sale_model_1.default.create(data);
exports.createSale = createSale;
// 
async function getSales(query) {
    try {
        const { currentPage, viewLimit, viewSkip, sortBy, sortOrder, filterConditions, sortConditions, } = (0, queryHandler_1.default)({ query, entity: constants_1.entities.sale });
        const fetchResult = await sale_model_1.default.find(filterConditions)
            .sort(sortConditions)
            .skip(viewSkip)
            .limit(viewLimit);
        const total = await sale_model_1.default.countDocuments(filterConditions);
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
    getSales,
    getSingleSale,
    createSale: exports.createSale,
    updateSale,
    deleteSale,
};
