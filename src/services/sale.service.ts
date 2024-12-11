/* eslint-disable @typescript-eslint/no-unused-vars */
import { entities } from "../config/constants";
import Sale from "../models/sale.model";
import { IDType, QueryParams } from "../types/requestResponse";
import { ISale, ISaleUpdatePayload } from "../types/sale.type";
import getSearchAndPagination from "../utils/queryHandler";

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

export const createSale = async (data: ISale) => {
  try {
    // const result = await saleService.deleteSale(req.query);
    // sendFetchResponse({ res, result, entity: entities.sale });
  } catch (error) {
    console.error(error);
    // sendErrorResponse({
    //   res,
    //   error,
    //   what: entities.category,
    // });
  }
};

export const getSingleSale = async (id: IDType) => {
  try {
    // const result = await saleService.deleteSale(req.query);
    // sendFetchResponse({ res, result, entity: entities.sale });
  } catch (error) {
    console.error(error);
    // sendErrorResponse({
    //   res,
    //   error,
    //   what: entities.category,
    // });
  }
};

export const updateSale = async ({ id, data }: ISaleUpdatePayload) => {
  try {
    // const result = await saleService.deleteSale(req.query);
    // sendFetchResponse({ res, result, entity: entities.sale });
  } catch (error) {
    console.error(error);
    // sendErrorResponse({
    //   res,
    //   error,
    //   what: entities.category,
    // });
  }
};

const deleteSale = async (id: IDType) => await Sale.findByIdAndDelete(id);


export default {
  getSales,
  getSingleSale,
  createSale,
  updateSale,
  deleteSale,
};
