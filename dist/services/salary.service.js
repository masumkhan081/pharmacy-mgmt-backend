"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../config/constants");
const prisma_1 = __importDefault(require("../lib/prisma"));
const queryHandler_1 = __importDefault(require("../utils/queryHandler"));
const getSingleSalary = async (id) => prisma_1.default.salary.findUnique({
    where: { id: id },
    include: { staff: true }
});
const deleteSalary = async (id) => await prisma_1.default.salary.delete({ where: { id: id } });
const createSalary = async (data) => await prisma_1.default.salary.create({
    data: {
        staffId: data.staff,
        amount: data.amount,
        month: data.month,
        year: data.year,
        paidAt: data.paidAt || new Date(),
    }
});
const updateSalary = async ({ id, data }) => await prisma_1.default.salary.update({
    where: { id: id },
    data
});
async function getSalaries(query) {
    try {
        const { currentPage, viewLimit, viewSkip, sortBy, sortOrder, searchTerm, } = (0, queryHandler_1.default)({ query, entity: constants_1.entities.salary });
        const where = searchTerm ? {
            staff: {
                name: { contains: searchTerm, mode: "insensitive" }
            }
        } : {};
        const fetchResult = await prisma_1.default.salary.findMany({
            where,
            skip: viewSkip,
            take: viewLimit,
            orderBy: sortBy ? { [sortBy]: sortOrder ?? "desc" } : { createdAt: "desc" },
            include: { staff: true }
        });
        const total = await prisma_1.default.salary.count({ where });
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
    getSalaries,
    getSingleSalary,
    createSalary,
    updateSalary,
    deleteSalary,
};
