"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../config/constants");
const prisma_1 = __importDefault(require("../lib/prisma"));
const queryHandler_1 = __importDefault(require("../utils/queryHandler"));
const createUnit = async (data) => await prisma_1.default.unit.create({ data });
const getSingleUnit = async (id) => await prisma_1.default.unit.findUnique({ where: { id: id } });
const updateUnit = async ({ id, data }) => await prisma_1.default.unit.update({ where: { id: id }, data });
const deleteUnit = async (id) => await prisma_1.default.unit.delete({ where: { id: id } });
async function getUnits(query) {
    try {
        const { currentPage, viewLimit, viewSkip, sortBy, sortOrder, searchTerm, } = (0, queryHandler_1.default)({ query, entity: constants_1.entities.unit });
        const where = searchTerm ? {
            name: { contains: searchTerm, mode: "insensitive" }
        } : {};
        const fetchResult = await prisma_1.default.unit.findMany({
            where,
            skip: viewSkip,
            take: viewLimit,
            orderBy: sortBy ? { [sortBy]: sortOrder ?? "desc" } : { createdAt: "desc" },
        });
        const total = await prisma_1.default.unit.count({ where });
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
    createUnit,
    updateUnit,
    getSingleUnit,
    deleteUnit,
    getUnits,
};
