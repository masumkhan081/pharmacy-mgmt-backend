"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSale = void 0;
const constants_1 = require("../config/constants");
const queryHandler_1 = __importDefault(require("../utils/queryHandler"));
const inventoryMovement_service_1 = __importDefault(require("./inventoryMovement.service"));
const auditLog_1 = require("../utils/auditLog");
const logger_1 = require("../utils/logger");
const sale_repository_1 = __importDefault(require("../repositories/sale.repository"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const getSingleSale = async (id) => sale_repository_1.default.findById(id);
const deleteSale = async ({ id, actor }) => {
    const sale = await sale_repository_1.default.findById(id);
    if (!sale)
        throw new Error("Sale not found");
    if (sale.isDeleted)
        return sale;
    const beforeState = JSON.parse(JSON.stringify(sale));
    const updated = await sale_repository_1.default.softDelete(id, actor);
    if (actor) {
        await (0, auditLog_1.createAuditLog)({
            actor,
            action: "SOFT_DELETE",
            entityType: "Sale",
            entityId: id,
            before: beforeState,
        });
    }
    return updated;
};
const createSale = async (data) => {
    return await prisma_1.default.$transaction(async (tx) => {
        try {
            const saleItems = [];
            const auditDetails = [];
            // Deduct stock for each drug in the sale
            for (const item of data.drugs) {
                const movementReceipt = await inventoryMovement_service_1.default.deductStock({
                    drugId: item.drug.toString(),
                    quantity: item.quantity,
                    tx,
                });
                saleItems.push({
                    drugId: item.drug.toString(),
                    quantity: item.quantity,
                    price: item.mrp,
                    batchMovements: movementReceipt.allocations.map(alloc => ({
                        batchId: alloc.batchId.toString(),
                        quantity: alloc.quantityMoved,
                    }))
                });
            }
            // Create the sale record in Prisma
            const savedSale = await sale_repository_1.default.create({
                saleNumber: `SALE-${Date.now()}`,
                totalBill: data.bill,
                actorId: data.actor || "SYSTEM",
                items: saleItems,
            }, tx);
            if (data.actor) {
                await (0, auditLog_1.createAuditLog)({
                    actor: data.actor,
                    action: "CREATE_SALE",
                    entityType: "Sale",
                    entityId: savedSale.id,
                    after: savedSale,
                });
            }
            return savedSale;
        }
        catch (error) {
            (0, logger_1.logOperationalFailure)("SALE", error, { data });
            throw error;
        }
    });
};
exports.createSale = createSale;
// 
async function getSales(query) {
    try {
        const { currentPage, viewLimit, viewSkip, sortBy, sortOrder, searchTerm, } = (0, queryHandler_1.default)({ query, entity: constants_1.entities.sale });
        const result = await sale_repository_1.default.search({
            searchTerm,
            skip: viewSkip,
            take: viewLimit,
            sortBy: sortBy,
            sortOrder: sortOrder,
        });
        return {
            meta: {
                total: result.total,
                limit: viewLimit,
                page: currentPage,
                skip: viewSkip,
                sortBy,
                sortOrder,
            },
            data: result.data,
        };
    }
    catch (error) {
        return error;
    }
}
exports.default = {
    getSales,
    getSingleSale,
    createSale: exports.createSale,
    deleteSale,
};
