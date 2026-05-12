"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../config/constants");
const prisma_1 = __importDefault(require("../lib/prisma"));
const queryHandler_1 = __importDefault(require("../utils/queryHandler"));
const createStaff = async (data) => await prisma_1.default.staff.create({ data });
const getSingleStaff = async (id) => await prisma_1.default.staff.findUnique({ where: { id: id } });
const updateStaff = async ({ id, data }) => await prisma_1.default.staff.update({ where: { id: id }, data });
const deleteStaff = async (id) => await prisma_1.default.staff.delete({ where: { id: id } });
async function getStaffs(query) {
    try {
        const { currentPage, viewLimit, viewSkip, sortBy, sortOrder, searchTerm, } = (0, queryHandler_1.default)({ query, entity: constants_1.entities.staff });
        const where = searchTerm ? {
            OR: [
                { name: { contains: searchTerm, mode: "insensitive" } },
                { email: { contains: searchTerm, mode: "insensitive" } },
            ]
        } : {};
        const fetchResult = await prisma_1.default.staff.findMany({
            where,
            skip: viewSkip,
            take: viewLimit,
            orderBy: sortBy ? { [sortBy]: sortOrder ?? "desc" } : { createdAt: "desc" },
        });
        const total = await prisma_1.default.staff.count({ where });
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
    createStaff,
    updateStaff,
    getSingleStaff,
    deleteStaff,
    getStaffs,
};
