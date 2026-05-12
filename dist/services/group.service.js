"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../config/constants");
const prisma_1 = __importDefault(require("../lib/prisma"));
const queryHandler_1 = __importDefault(require("../utils/queryHandler"));
const createGroup = async (data) => await prisma_1.default.group.create({ data });
const getSingleGroup = async (id) => await prisma_1.default.group.findUnique({ where: { id: id } });
const updateGroup = async ({ id, data }) => await prisma_1.default.group.update({ where: { id: id }, data });
const deleteGroup = async (id) => await prisma_1.default.group.delete({ where: { id: id } });
async function getGroups(query) {
    try {
        const { currentPage, viewLimit, viewSkip, sortBy, sortOrder, searchTerm, } = (0, queryHandler_1.default)({ query, entity: constants_1.entities.group });
        const where = searchTerm ? {
            name: { contains: searchTerm, mode: "insensitive" }
        } : {};
        const fetchResult = await prisma_1.default.group.findMany({
            where,
            skip: viewSkip,
            take: viewLimit,
            orderBy: sortBy ? { [sortBy]: sortOrder ?? "desc" } : { createdAt: "desc" },
        });
        const total = await prisma_1.default.group.count({ where });
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
    createGroup,
    updateGroup,
    getSingleGroup,
    deleteGroup,
    getGroups,
};
