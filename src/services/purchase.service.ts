/* eslint-disable @typescript-eslint/no-unused-vars */
import { entities } from "../config/constants";
import Purchase from "../models/purchase.model";
import { IDType, QueryParams } from "../types/requestResponse";
import { IPurchase, IPurchaseUpdatePayload } from "../types/purchase.type";
import getSearchAndPagination from "../utils/queryHandler";

//

async function getPurchases(query: QueryParams) {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      filterConditions,
      sortConditions,
    } = getSearchAndPagination({ query, entity: entities.purchase });

    const fetchResult = await Purchase.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await Purchase.countDocuments(filterConditions);
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

export const createPurchase = async (data: IPurchase) => {
  try {
    // const result = await purchaseService.deletePurchase(req.query);
    // sendFetchResponse({ res, result, entity: entities.purchase });
  } catch (error) {
    console.error(error);
    // sendErrorResponse({
    //   res,
    //   error,
    //   what: entities.category,
    // });
  }
};

export const getSinglePurchase = async (id: IDType) => {
  try {
    // const result = await purchaseService.deletePurchase(req.query);
    // sendFetchResponse({ res, result, entity: entities.purchase });
  } catch (error) {
    console.error(error);
    // sendErrorResponse({
    //   res,
    //   error,
    //   what: entities.category,
    // });
  }
};

export const updatePurchase = async ({ id, data }: IPurchaseUpdatePayload) => {
  try {
    // const result = await purchaseService.deletePurchase(req.query);
    // sendFetchResponse({ res, result, entity: entities.purchase });
  } catch (error) {
    console.error(error);
    // sendErrorResponse({
    //   res,
    //   error,
    //   what: entities.category,
    // });
  }
};

const deletePurchase = async (id: IDType) => await Purchase.findByIdAndDelete(id);

export default {
  getPurchases,
  getSinglePurchase,
  createPurchase,
  updatePurchase,
  deletePurchase,
};
