import { entities } from "../config/constants";
import Generic from "../models/generic.model";
import { IDType, QueryParams } from "../types/requestResponse";
import { IGeneric, IGenericUpdatePayload } from "../types/generic.type";
import getSearchAndPagination from "../utils/queryHandler";
//
const createGeneric = async (data: IGeneric) => await Generic.create(data);
//
const getSingleGeneric = async (id: IDType) => Generic.findById(id);
//
const updateGeneric = async ({ id, data }: IGenericUpdatePayload) =>
  await Generic.findByIdAndUpdate(id, data, { new: true });
//
const deleteGeneric = async (id: IDType) => await Generic.findByIdAndDelete(id);
//
async function getGenerics(query: QueryParams) {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      filterConditions,
      sortConditions,
    } = getSearchAndPagination({ query, entity: entities.generic });

    const fetchResult = await Generic.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await Generic.countDocuments(filterConditions);
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
  createGeneric,
  updateGeneric,
  getSingleGeneric,
  deleteGeneric,
  getGenerics,
};
