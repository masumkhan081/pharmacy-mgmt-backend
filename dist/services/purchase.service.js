"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPurchase = void 0;
const constants_1 = require("../config/constants");
const queryHandler_1 = __importDefault(require("../utils/queryHandler"));
const inventoryBatch_repository_1 = __importDefault(require("../repositories/inventoryBatch.repository"));
const inventoryMovement_service_1 = __importDefault(require("./inventoryMovement.service"));
const auditLog_1 = require("../utils/auditLog");
const purchase_repository_1 = __importDefault(require("../repositories/purchase.repository"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const getSinglePurchase = async (id) => purchase_repository_1.default.findById(id);
// 
const createPurchase = async (data) => {
    return await prisma_1.default.$transaction(async (tx) => {
        try {
            const purchaseItems = [];
            const now = new Date();
            // Process each incoming drug line
            for (const item of data.drugs) {
                if (item.quantity <= 0) {
                    throw new Error("Quantity must be positive");
                }
                const itemExpiration = new Date(item.expirationDate);
                if (itemExpiration <= now) {
                    throw new Error(`Cannot purchase expired batch for drug: ${item.drug}`);
                }
                // 1. Check for duplicate batch (same drug + same batchNumber)
                let targetBatchId = null;
                const existingBatch = await inventoryBatch_repository_1.default.findByDrugAndBatchNumber(item.drug.toString(), item.batchNumber, tx);
                if (existingBatch) {
                    // Enforce duplicate batch rules
                    if (Math.abs(existingBatch.purchasePrice - item.purchasePrice) > 0.01 ||
                        Math.abs(existingBatch.sellingPrice - item.mrp) > 0.01 ||
                        existingBatch.expirationDate.getTime() !== itemExpiration.getTime()) {
                        throw new Error(`Batch ${item.batchNumber} already exists with different pricing or expiration.`);
                    }
                    targetBatchId = existingBatch.id;
                }
                else {
                    // Create new batch explicitly inside the transaction with 0 currentQuantity
                    const savedBatch = await inventoryBatch_repository_1.default.create({
                        drugId: item.drug.toString(),
                        batchNumber: item.batchNumber,
                        initialQuantity: item.quantity,
                        currentQuantity: 0,
                        purchasePrice: item.purchasePrice,
                        sellingPrice: item.mrp,
                        expirationDate: itemExpiration,
                    }, tx);
                    targetBatchId = savedBatch.id;
                }
                // 2. Safely receive stock via the authoritative movement pipeline
                await inventoryMovement_service_1.default.receiveStock({
                    drugId: item.drug.toString(),
                    batchId: targetBatchId,
                    quantity: item.quantity,
                    tx,
                });
                // 3. Keep record for purchase item
                purchaseItems.push({
                    drugId: item.drug.toString(),
                    quantity: item.quantity,
                    price: item.purchasePrice,
                });
            }
            // 4. Create the final purchase record in Prisma
            const savedPurchase = await purchase_repository_1.default.create({
                purchaseNumber: `PUR-${Date.now()}`,
                purchaseDate: new Date(data.purchaseAt),
                totalCost: data.bill || 0,
                status: "RECEIVED",
                supplierId: data.supplier?.toString(),
                actorId: data.actor,
                items: purchaseItems,
            }, tx);
            if (data.actor) {
                await (0, auditLog_1.createAuditLog)({
                    actor: data.actor,
                    action: "CREATE_PURCHASE",
                    entityType: "Purchase",
                    entityId: savedPurchase.id,
                    after: savedPurchase,
                });
            }
            return savedPurchase;
        }
        catch (error) {
            throw error;
        }
    });
};
exports.createPurchase = createPurchase;
const deletePurchase = async ({ id, actor }) => {
    const purchase = await purchase_repository_1.default.findById(id);
    if (!purchase)
        throw new Error("Purchase not found");
    if (purchase.isDeleted)
        return purchase;
    const beforeState = JSON.parse(JSON.stringify(purchase));
    const updated = await purchase_repository_1.default.softDelete(id, actor);
    if (actor) {
        await (0, auditLog_1.createAuditLog)({
            actor,
            action: "SOFT_DELETE",
            entityType: "Purchase",
            entityId: id,
            before: beforeState,
        });
    }
    return updated;
};
// 
async function getPurchases(query) {
    try {
        const { currentPage, viewLimit, viewSkip, sortBy, sortOrder, searchTerm, } = (0, queryHandler_1.default)({ query, entity: constants_1.entities.purchase });
        const result = await purchase_repository_1.default.search({
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
    getPurchases,
    getSinglePurchase,
    createPurchase: exports.createPurchase,
    deletePurchase,
};
