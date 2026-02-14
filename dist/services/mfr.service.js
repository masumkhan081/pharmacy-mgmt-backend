"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mfr_model_1 = __importDefault(require("../models/mfr.model"));
const queryHandler_1 = __importDefault(require("../utils/queryHandler"));
const constants_1 = require("../config/constants");
// Create a new manufacturer
const createManufacturer = async (data) => {
    return await mfr_model_1.default.create(data);
};
// Get a single manufacturer by ID
const getSingleManufacturer = async (id) => {
    return await mfr_model_1.default.findById(id);
};
// Update a manufacturer
const updateManufacturer = async ({ id, data }) => {
    return await mfr_model_1.default.findByIdAndUpdate(id, data, { new: true });
};
// Delete a manufacturer
const deleteManufacturer = async (id) => {
    return await mfr_model_1.default.findByIdAndDelete(id);
};
// Get all manufacturers with pagination and filtering
const getManufacturers = async (query) => {
    try {
        const { currentPage, viewLimit, viewSkip, sortBy, sortOrder, filterConditions, sortConditions, } = (0, queryHandler_1.default)({
            query,
            entity: constants_1.entities.manufacturer
        });
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
};
exports.default = {
    createManufacturer,
    getSingleManufacturer,
    updateManufacturer,
    deleteManufacturer,
    getManufacturers,
};
