"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../config/constants");
const prisma_1 = __importDefault(require("../lib/prisma"));
const queryHandler_1 = __importDefault(require("../utils/queryHandler"));
const createAttendance = async (data) => await prisma_1.default.attendance.create({
    data: {
        staffId: data.staff,
        date: data.date || new Date(),
        status: data.status,
    }
});
const getSingleAttendance = async (id) => prisma_1.default.attendance.findUnique({
    where: { id: id },
    include: { staff: true }
});
const updateAttendance = async ({ id, data }) => await prisma_1.default.attendance.update({
    where: { id: id },
    data
});
const deleteAttendance = async (id) => await prisma_1.default.attendance.delete({ where: { id: id } });
async function getAttendances(query) {
    try {
        const { currentPage, viewLimit, viewSkip, sortBy, sortOrder, searchTerm, } = (0, queryHandler_1.default)({ query, entity: constants_1.entities.attendance });
        const where = searchTerm ? {
            staff: {
                name: { contains: searchTerm, mode: "insensitive" }
            }
        } : {};
        const fetchResult = await prisma_1.default.attendance.findMany({
            where,
            skip: viewSkip,
            take: viewLimit,
            orderBy: sortBy ? { [sortBy]: sortOrder ?? "desc" } : { date: "desc" },
            include: { staff: true }
        });
        const total = await prisma_1.default.attendance.count({ where });
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
