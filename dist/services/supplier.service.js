"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../config/constants");
const prisma_1 = __importDefault(require("../lib/prisma"));
const queryHandler_1 = __importDefault(require("../utils/queryHandler"));
const createSupplier = async (data) => await prisma_1.default.supplier.create({ data });
const getSingleSupplier = async (id) => await prisma_1.default.supplier.findUnique({ where: { id: id } });
const updateSupplier = async ({ id, data }) => await prisma_1.default.supplier.update({ where: { id: id }, data });
const deleteSupplier = async (id) => await prisma_1.default.supplier.delete({ where: { id: id } });
async function getSuppliers(query) {
    try {
        const { currentPage, viewLimit, viewSkip, sortBy, sortOrder, searchTerm, } = (0, queryHandler_1.default)({ query, entity: constants_1.entities.supplier });
        const where = searchTerm ? {
            OR: [
                { name: { contains: searchTerm, mode: "insensitive" } },
                { email: { contains: searchTerm, mode: "insensitive" } },
            ]
        } : {};
        const fetchResult = await prisma_1.default.supplier.findMany({
            where,
            skip: viewSkip,
            take: viewLimit,
            orderBy: sortBy ? { [sortBy]: sortOrder ?? "desc" } : { createdAt: "desc" },
        });
        const total = await prisma_1.default.supplier.count({ where });
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
    getSuppliers,
    getSingleSupplier,
    createSupplier,
    updateSupplier,
    deleteSupplier,
};
