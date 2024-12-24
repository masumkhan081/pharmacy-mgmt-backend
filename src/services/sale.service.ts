 
import { entities } from "../config/constants";
import Sale from "../models/sale.model";
import { IDType, QueryParams } from "../types/requestResponse";
import { ISale, ISaleUpdatePayload } from "../types/sale.type";
import getSearchAndPagination from "../utils/queryHandler";
//
const getSingleSale = async (id: IDType) => Sale.findById(id);
//
const updateSale = async ({ id, data }: ISaleUpdatePayload) =>
  await Sale.findByIdAndUpdate(id, data, { new: true });
//
const deleteSale = async (id: IDType) => await Sale.findByIdAndDelete(id);
// 
export const createSale = async (data: ISale) => await Sale.create(data);
// 
async function getSales(query: QueryParams) {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      filterConditions,
      sortConditions,
    } = getSearchAndPagination({ query, entity: entities.sale });

    const fetchResult = await Sale.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await Sale.countDocuments(filterConditions);
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
  getSales,
  getSingleSale,
  createSale,
  updateSale,
  deleteSale,
};
