"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../config/constants");
const brand_model_1 = __importDefault(require("../models/brand.model"));
const queryHandler_1 = __importDefault(require("../utils/queryHandler"));
//
const createBrand = async (data) => await brand_model_1.default.create(data);
//
const getSingleBrand = async (id) => brand_model_1.default.findById(id);
//
const updateBrand = async ({ id, data }) => await brand_model_1.default.findByIdAndUpdate(id, data, { new: true });
//
const deleteBrand = async (id) => await brand_model_1.default.findByIdAndDelete(id);
//
async function getBrands(query) {
    try {
        const { currentPage, viewLimit, viewSkip, sortBy, sortOrder, filterConditions, sortConditions, } = (0, queryHandler_1.default)({ query, entity: constants_1.entities.brand });
        const fetchResult = await brand_model_1.default.find(filterConditions)
            .sort(sortConditions)
            .skip(viewSkip)
            .limit(viewLimit);
        const total = await brand_model_1.default.countDocuments(filterConditions);
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
    createBrand,
    updateBrand,
    getSingleBrand,
    deleteBrand,
    getBrands,
};
