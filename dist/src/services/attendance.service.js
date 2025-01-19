"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../config/constants");
const attendance_model_1 = __importDefault(require("../models/attendance.model"));
const queryHandler_1 = __importDefault(require("../utils/queryHandler"));
//
const createAttendance = async (data) => await attendance_model_1.default.create(data);
//
const getSingleAttendance = async (id) => attendance_model_1.default.findById(id);
//
const updateAttendance = async ({ id, data }) => await attendance_model_1.default.findByIdAndUpdate(id, data, { new: true });
//
const deleteAttendance = async (id) => await attendance_model_1.default.findByIdAndDelete(id);
//
async function getAttendances(query) {
    try {
        const { currentPage, viewLimit, viewSkip, sortBy, sortOrder, filterConditions, sortConditions, } = (0, queryHandler_1.default)({ query, entity: constants_1.entities.attendance });
        const fetchResult = await attendance_model_1.default.find(filterConditions)
            .sort(sortConditions)
            .skip(viewSkip)
            .limit(viewLimit);
        const total = await attendance_model_1.default.countDocuments(filterConditions);
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
    createAttendance,
    updateAttendance,
    getSingleAttendance,
    deleteAttendance,
    getAttendances,
};
