/* eslint-disable @typescript-eslint/no-unused-vars */
import { entities } from "../config/constants";
import Salary from "../models/salary.model";
import { IDType, QueryParams } from "../types/requestResponse";
import { ISalary, ISalaryUpdatePayload } from "../types/salary.type";
import getSearchAndPagination from "../utils/queryHandler";

//

async function getSalaries(query: QueryParams) {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      filterConditions,
      sortConditions,
    } = getSearchAndPagination({ query, entity: entities.salary });

    const fetchResult = await Salary.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await Salary.countDocuments(filterConditions);
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

export const createSalary = async (data: ISalary) => {
  try {
    // const result = await salaryService.deleteSalary(req.query);
    // sendFetchResponse({ res, result, entity: entities.salary });
  } catch (error) {
    console.error(error);
    // sendErrorResponse({
    //   res,
    //   error,
    //   what: entities.category,
    // });
  }
};

export const getSingleSalary = async (id: IDType) => {
  try {
    // const result = await salaryService.deleteSalary(req.query);
    // sendFetchResponse({ res, result, entity: entities.salary });
  } catch (error) {
    console.error(error);
    // sendErrorResponse({
    //   res,
    //   error,
    //   what: entities.category,
    // });
  }
};

export const updateSalary = async ({ id, data }: ISalaryUpdatePayload) => {
  try {
    // const result = await salaryService.deleteSalary(req.query);
    // sendFetchResponse({ res, result, entity: entities.salary });
  } catch (error) {
    console.error(error);
    // sendErrorResponse({
    //   res,
    //   error,
    //   what: entities.category,
    // });
  }
};

export const deleteSalary = async (id: string) => {
  try {
    // const result = await salaryService.deleteSalary(req.query);
    // sendFetchResponse({ res, result, entity: entities.salary });
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
  getSalaries,
  getSingleSalary,
  createSalary,
  updateSalary,
  deleteSalary,
};
