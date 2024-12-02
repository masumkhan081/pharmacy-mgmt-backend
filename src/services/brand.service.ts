 
import { entities } from "../config/constants";
import Brand from "../models/brand.model";
import { IDType, QueryParams } from "../types/requestResponse";
import { IBrand, IBrandUpdatePayload } from "../types/brand.type";
import getSearchAndPagination from "../utils/queryHandler";
//
const createBrand = async (data: IBrand) => await Brand.create(data);
//
const getSingleBrand = async (id: IDType) => Brand.findById(id);
//
const updateBrand = async ({ id, data }: IBrandUpdatePayload) =>
  await Brand.findByIdAndUpdate(id, data, { new: true });
//
const deleteBrand = async (id: IDType) => await Brand.findByIdAndDelete(id);
//
async function getBrands(query: QueryParams) {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      filterConditions,
      sortConditions,
    } = getSearchAndPagination({ query, entity: entities.brand });

    const fetchResult = await Brand.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await Brand.countDocuments(filterConditions);
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
  createBrand,
  updateBrand,
  getSingleBrand,
  deleteBrand,
  getBrands,
};
