/* eslint-disable @typescript-eslint/no-unused-vars */
import { entities } from "../config/constants";
import Unit from "../models/unit.model";
import { IDType, QueryParams } from "../types/requestResponse";
import { IUnit, IUnitUpdatePayload } from "../types/unit.type";
import getSearchAndPagination from "../utils/queryHandler";
//
async function getUnits(query: QueryParams) {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      filterConditions,
      sortConditions,
    } = getSearchAndPagination({ query, entity: entities.unit });

    const fetchResult = await Unit.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await Unit.countDocuments(filterConditions);
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

export const createUnit = async (data: IUnit) => {
  try {
    // const result = await unitService.deleteUnit(req.query);
    // sendFetchResponse({ res, result, entity: entities.unit });
  } catch (error) {
    console.error(error);
    // sendErrorResponse({
    //   res,
    //   error,
    //   what: entities.category,
    // });
  }
};

export const getSingleUnit = async (id: IDType) => {
  try {
    // const result = await unitService.deleteUnit(req.query);
    // sendFetchResponse({ res, result, entity: entities.unit });
  } catch (error) {
    console.error(error);
    // sendErrorResponse({
    //   res,
    //   error,
    //   what: entities.category,
    // });
  }
};

export const updateUnit = async ({ id, data }: IUnitUpdatePayload) => {
  try {
    // const result = await unitService.deleteUnit(req.query);
    // sendFetchResponse({ res, result, entity: entities.unit });
  } catch (error) {
    console.error(error);
    // sendErrorResponse({
    //   res,
    //   error,
    //   what: entities.category,
    // });
  }
};

export const deleteUnit = async (id: string) => {
  try {
    // const result = await unitService.deleteUnit(req.query);
    // sendFetchResponse({ res, result, entity: entities.unit });
  } catch (error) {
    console.error(error);
    // sendErrorResponse({
    //   res,
    //   error,
    //   what: entities.category,
    // });
  }
};

export default {
  getUnits,
  getSingleUnit,
  createUnit,
  updateUnit,
  deleteUnit,
};
