"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../config/constants");
const generic_repository_1 = __importDefault(require("../repositories/generic.repository"));
const queryHandler_1 = __importDefault(require("../utils/queryHandler"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const createGeneric = async (data) => await generic_repository_1.default.create(data);
const getSingleGeneric = async (id) => await generic_repository_1.default.findById(id);
const updateGeneric = async ({ id, data }) => await generic_repository_1.default.update(id, data);
const deleteGeneric = async (id) => await generic_repository_1.default.deleteById(id);
async function getGenerics(query) {
    try {
        const { currentPage, viewLimit, viewSkip, sortBy, sortOrder, searchTerm, } = (0, queryHandler_1.default)({ query, entity: constants_1.entities.generic });
        const where = searchTerm ? {
            name: { contains: searchTerm, mode: "insensitive" }
        } : {};
        const fetchResult = await prisma_1.default.generic.findMany({
            where,
            skip: viewSkip,
            take: viewLimit,
            orderBy: sortBy ? { [sortBy]: sortOrder ?? "desc" } : { createdAt: "desc" },
        });
        const total = await prisma_1.default.generic.count({ where });
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
    createGeneric,
    updateGeneric,
    getSingleGeneric,
    deleteGeneric,
    getGenerics,
};
