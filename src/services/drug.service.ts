 
import { entities } from "../config/constants";
import Drug from "../models/drug.model";
import { IDType, QueryParams } from "../types/requestResponse";
import { IDrug,IDrugUpdatePayload } from "../types/drug.type";
import getSearchAndPagination from "../utils/queryHandler";
//
//
const createDrug = async (data: IDrug) => await Drug.create(data);
//
const getSingleDrug = async (id: IDType) => Drug.findById(id);
//
const updateDrug = async ({ id, data }: IDrugUpdatePayload) =>
  await Drug.findByIdAndUpdate(id, data, { new: true });
//
const deleteDrug = async (id: IDType) => await Drug.findByIdAndDelete(id);
//
async function getDrugs(query: QueryParams) {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      filterConditions,
      sortConditions,
    } = getSearchAndPagination({ query, entity: entities.drug });

    const fetchResult = await Drug.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await Drug.countDocuments(filterConditions);
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