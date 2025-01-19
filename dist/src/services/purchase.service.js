"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePurchase = exports.createPurchase = void 0;
const constants_1 = require("../config/constants");
const purchase_model_1 = __importDefault(require("../models/purchase.model"));
const queryHandler_1 = __importDefault(require("../utils/queryHandler"));
//
const getSinglePurchase = async (id) => purchase_model_1.default.findById(id);
// 
const createPurchase = async (data) => await purchase_model_1.default.create(data);
exports.createPurchase = createPurchase;
// 
const updatePurchase = async ({ id, data }) => await purchase_model_1.default.findByIdAndUpdate(id, data, { new: true });
exports.updatePurchase = updatePurchase;
// 
const deletePurchase = async (id) => await purchase_model_1.default.findByIdAndDelete(id);
// 
async function getPurchases(query) {
    try {
        const { currentPage, viewLimit, viewSkip, sortBy, sortOrder, filterConditions, sortConditions, } = (0, queryHandler_1.default)({ query, entity: constants_1.entities.purchase });
        const fetchResult = await purchase_model_1.default.find(filterConditions)
            .sort(sortConditions)
            .skip(viewSkip)
            .limit(viewLimit);
        const total = await purchase_model_1.default.countDocuments(filterConditions);
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
    getPurchases,
    getSinglePurchase,
    createPurchase: exports.createPurchase,
    updatePurchase: exports.updatePurchase,
    deletePurchase,
};
