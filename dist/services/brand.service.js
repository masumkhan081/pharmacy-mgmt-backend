"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../config/constants");
const brand_repository_1 = __importDefault(require("../repositories/brand.repository"));
const queryHandler_1 = __importDefault(require("../utils/queryHandler"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const createBrand = async (data) => await brand_repository_1.default.create(data);
const getSingleBrand = async (id) => await brand_repository_1.default.findById(id);
const updateBrand = async ({ id, data }) => await brand_repository_1.default.update(id, data);
const deleteBrand = async (id) => await brand_repository_1.default.deleteById(id);
async function getBrands(query) {
    try {
        const { currentPage, viewLimit, viewSkip, sortBy, sortOrder, searchTerm, } = (0, queryHandler_1.default)({ query, entity: constants_1.entities.brand });
        const where = searchTerm ? {
            name: { contains: searchTerm, mode: "insensitive" }
        } : {};
        const fetchResult = await prisma_1.default.brand.findMany({
            where,
            skip: viewSkip,
            take: viewLimit,
            orderBy: sortBy ? { [sortBy]: sortOrder ?? "desc" } : { createdAt: "desc" },
        });
        const total = await prisma_1.default.brand.count({ where });
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
    createBrand,
    updateBrand,
    getSingleBrand,
    deleteBrand,
    getBrands,
};
