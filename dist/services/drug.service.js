"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../config/constants");
const drug_repository_1 = __importDefault(require("../repositories/drug.repository"));
const brand_repository_1 = __importDefault(require("../repositories/brand.repository"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const queryHandler_1 = __importDefault(require("../utils/queryHandler"));
//
const auditLog_1 = require("../utils/auditLog");
const createDrug = async (data) => {
    // 1. Fetch Brand and Unit from Prisma to build denormalized name
    const brandDoc = await brand_repository_1.default.findById(data.brand);
    const unitDoc = await prisma_1.default.unit.findUnique({ where: { id: data.unit } });
    if (!brandDoc)
        throw new Error("Invalid brand reference");
    const denormalizedName = `${brandDoc.name} ${data.strength}${unitDoc?.name || ""}`;
    // 2. Create in Prisma
    const drug = await drug_repository_1.default.create({
        name: denormalizedName,
        brandId: data.brand,
        formulationId: data.formulation,
        strength: data.strength,
        unitId: data.unit,
        available: data.available,
        purchasePrice: data.purchasePrice || 0,
        mrp: data.mrp,
        status: data.status,
    });
    if (data.actor) {
        await (0, auditLog_1.createAuditLog)({
            actor: data.actor,
            action: "CREATE_DRUG",
            entityType: "Drug",
            entityId: drug.id,
            after: drug,
        });
    }
    return drug;
};
//
const getSingleDrug = async (id) => drug_repository_1.default.findById(id);
//
const updateDrug = async ({ id, data, actor }) => {
    const before = await drug_repository_1.default.findById(id);
    if (!before)
        throw new Error("Drug not found");
    // If brand/strength/unit changed, rebuild name
    let name = data.name;
    if (!name && (data.brandId || data.strength || data.unitId)) {
        const brandId = data.brandId || before.brandId;
        const strength = data.strength || before.strength;
        const unitId = data.unitId || before.unitId;
        const brandDoc = await brand_repository_1.default.findById(brandId);
        const unitDoc = await prisma_1.default.unit.findUnique({ where: { id: unitId } });
        if (brandDoc) {
            name = `${brandDoc.name} ${strength}${unitDoc?.name || ""}`;
        }
    }
    const updated = await drug_repository_1.default.update(id, { ...data, name });
    if (actor && updated) {
        await (0, auditLog_1.createAuditLog)({
            actor,
            action: "UPDATE_DRUG",
            entityType: "Drug",
            entityId: updated.id,
            before: before,
            after: updated,
        });
    }
    return updated;
};
//
const deleteDrug = async ({ id, actor }) => {
    const drug = await drug_repository_1.default.findById(id);
    if (!drug)
        throw new Error("Drug not found");
    if (drug.isDeleted)
        return drug;
    // Check for operational history in Prisma
    const hasHistory = await drug_repository_1.default.hasOperationalHistory(id);
    if (hasHistory) {
        throw new Error("Cannot delete drug with operational history (batches, sales, or purchases). Please mark it as INACTIVE instead.");
    }
    const beforeState = { ...drug };
    const deleted = await drug_repository_1.default.softDelete(id, actor);
    if (actor) {
        await (0, auditLog_1.createAuditLog)({
            actor,
            action: "SOFT_DELETE",
            entityType: "Drug",
            entityId: deleted.id,
            before: beforeState,
        });
    }
    return deleted;
};
//
async function getDrugs(query) {
    try {
        const { currentPage, viewLimit, viewSkip, sortBy, sortOrder, searchTerm, } = (0, queryHandler_1.default)({ query, entity: constants_1.entities.drug });
        const { data, total } = await drug_repository_1.default.search({
            searchTerm,
            skip: viewSkip,
            take: viewLimit,
            sortBy,
            sortOrder,
            isDeleted: query.includeDeleted === "true",
        });
        return {
            meta: {
                total,
                limit: viewLimit,
                page: currentPage,
                skip: viewSkip,
                sortBy,
                sortOrder,
            },
            data,
        };
    }
    catch (error) {
        return error;
    }
}
exports.default = {
    createDrug,
    updateDrug,
    getSingleDrug,
    deleteDrug,
    getDrugs,
};
