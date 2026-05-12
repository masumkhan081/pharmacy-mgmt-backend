 
import { entities } from "../config/constants";
import drugRepository from "../repositories/drug.repository";
import brandRepository from "../repositories/brand.repository";
import prisma from "../lib/prisma";
import { IDType, QueryParams } from "../types/requestResponse";
import { IDrug,IDrugUpdatePayload } from "../types/drug.type";
import getSearchAndPagination from "../utils/queryHandler";
//
import { createAuditLog } from "../utils/auditLog";

const createDrug = async (data: any & { actor?: string }) => {
  // 1. Fetch Brand and Unit from Prisma to build denormalized name
  const brandDoc = await brandRepository.findById(data.brand);
  const unitDoc = await prisma.unit.findUnique({ where: { id: data.unit } });
  
  if (!brandDoc) throw new Error("Invalid brand reference");
  
  const denormalizedName = `${brandDoc.name} ${data.strength}${unitDoc?.name || ""}`;

  // 2. Create in Prisma
  const drug = await drugRepository.create({
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
    await createAuditLog({
      actor: data.actor,
      action: "CREATE_DRUG",
      entityType: "Drug",
      entityId: drug.id as any,
      after: drug as any,
    });
  }
  return drug;
};
//
const getSingleDrug = async (id: IDType) => drugRepository.findById(id as string);
//
const updateDrug = async ({ id, data, actor }: IDrugUpdatePayload & { actor?: string }) => {
  const before = await drugRepository.findById(id);
  if (!before) throw new Error("Drug not found");

  // If brand/strength/unit changed, rebuild name
  let name = data.name;
  if (!name && (data.brandId || data.strength || data.unitId)) {
    const brandId = data.brandId || before.brandId;
    const strength = data.strength || before.strength;
    const unitId = data.unitId || before.unitId;
    
    const brandDoc = await brandRepository.findById(brandId);
    const unitDoc = await prisma.unit.findUnique({ where: { id: unitId } });
    if (brandDoc) {
      name = `${brandDoc.name} ${strength}${unitDoc?.name || ""}`;
    }
  }

  const updated = await drugRepository.update(id, { ...data, name });
  
  if (actor && updated) {
    await createAuditLog({
      actor,
      action: "UPDATE_DRUG",
      entityType: "Drug",
      entityId: updated.id as any,
      before: before as any,
      after: updated as any,
    });
  }
  return updated;
};
//
const deleteDrug = async ({ id, actor }: { id: IDType; actor: string | undefined }) => {
  const drug = await drugRepository.findById(id as string);
  if (!drug) throw new Error("Drug not found");
  if (drug.isDeleted) return drug;

  // Check for operational history in Prisma
  const hasHistory = await drugRepository.hasOperationalHistory(id as string);

  if (hasHistory) {
    throw new Error("Cannot delete drug with operational history (batches, sales, or purchases). Please mark it as INACTIVE instead.");
  }

  const beforeState = { ...drug };

  const deleted = await drugRepository.softDelete(id as string, actor);

  if (actor) {
    await createAuditLog({
      actor,
      action: "SOFT_DELETE",
      entityType: "Drug",
      entityId: deleted.id as any,
      before: beforeState as any,
    });
  }

  return deleted;
};
//
async function getDrugs(query: QueryParams) {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      searchTerm,
    } = getSearchAndPagination({ query, entity: entities.drug });

    const { data, total } = await drugRepository.search({
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
  } catch (error) {
    return error;
  }
}

export default {
  createDrug,
  updateDrug,
  getSingleDrug,
  deleteDrug,
  getDrugs,
};