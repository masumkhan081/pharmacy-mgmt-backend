"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../config/constants");
const supplier_model_1 = __importDefault(require("../models/supplier.model"));
const queryHandler_1 = __importDefault(require("../utils/queryHandler"));
//
const createSupplier = async (data) => await supplier_model_1.default.create(data);
//
const getSingleSupplier = async (id) => supplier_model_1.default.findById(id);
//
const updateSupplier = async ({ id, data }) => await supplier_model_1.default.findByIdAndUpdate(id, data, { new: true });
//
const deleteSupplier = async (id) => await supplier_model_1.default.findByIdAndDelete(id);
//
async function getSuppliers(query) {
    try {
        const { currentPage, viewLimit, viewSkip, sortBy, sortOrder, filterConditions, sortConditions, } = (0, queryHandler_1.default)({ query, entity: constants_1.entities.unit });
        const fetchResult = await supplier_model_1.default.find(filterConditions)
            .sort(sortConditions)
            .skip(viewSkip)
            .limit(viewLimit);
        const total = await supplier_model_1.default.countDocuments(filterConditions);
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
    getSuppliers,
    getSingleSupplier,
    createSupplier,
    updateSupplier,
    deleteSupplier,
};
