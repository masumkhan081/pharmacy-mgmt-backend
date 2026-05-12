"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../config/constants");
const prisma_1 = __importDefault(require("../lib/prisma"));
const queryHandler_1 = __importDefault(require("../utils/queryHandler"));
const createFormulation = async (data) => await prisma_1.default.formulation.create({ data });
const getSingleFormulation = async (id) => await prisma_1.default.formulation.findUnique({ where: { id: id } });
const updateFormulation = async ({ id, data }) => await prisma_1.default.formulation.update({ where: { id: id }, data });
const deleteFormulation = async (id) => await prisma_1.default.formulation.delete({ where: { id: id } });
async function getFormulations(query) {
    try {
        const { currentPage, viewLimit, viewSkip, sortBy, sortOrder, searchTerm, } = (0, queryHandler_1.default)({ query, entity: constants_1.entities.formulation });
        const where = searchTerm ? {
            name: { contains: searchTerm, mode: "insensitive" }
        } : {};
        const fetchResult = await prisma_1.default.formulation.findMany({
            where,
            skip: viewSkip,
            take: viewLimit,
            orderBy: sortBy ? { [sortBy]: sortOrder ?? "desc" } : { createdAt: "desc" },
        });
        const total = await prisma_1.default.formulation.count({ where });
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
    createFormulation,
    updateFormulation,
    getSingleFormulation,
    deleteFormulation,
    getFormulations,
};
