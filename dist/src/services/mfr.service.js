"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../config/constants");
const mfr_model_1 = __importDefault(require("../models/mfr.model"));
const queryHandler_1 = __importDefault(require("../utils/queryHandler"));
//
const createManufacturer = async (data) => await mfr_model_1.default.create(data);
//
const getSingleManufacturer = async (id) => mfr_model_1.default.findById(id);
//
const updateManufacturer = async ({ id, data }) => await mfr_model_1.default.findByIdAndUpdate(id, data, { new: true });
//
const deleteManufacturer = async (id) => await mfr_model_1.default.findByIdAndDelete(id);
//
async function getManufacturers(query) {
    try {
        const { currentPage, viewLimit, viewSkip, sortBy, sortOrder, filterConditions, sortConditions, } = (0, queryHandler_1.default)({ query, entity: constants_1.entities.manufacturer });
        const fetchResult = await mfr_model_1.default.find(filterConditions)
            .sort(sortConditions)
            .skip(viewSkip)
            .limit(viewLimit);
        const total = await mfr_model_1.default.countDocuments(filterConditions);
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
    createManufacturer,
    updateManufacturer,
    getSingleManufacturer,
    deleteManufacturer,
    getManufacturers,
};
