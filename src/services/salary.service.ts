/* eslint-disable @typescript-eslint/no-unused-vars */
import { entities } from "../config/constants";
import Salary from "../models/salary.model";
import { IDType, QueryParams } from "../types/requestResponse";
import { ISalary, ISalaryUpdatePayload } from "../types/salary.type";
import getSearchAndPagination from "../utils/queryHandler";
//
const getSingleSalary = async (id: IDType) => Salary.findById(id);

const deleteSalary = async (id: IDType) => await Salary.findByIdAndDelete(id);
// 
export const createSalary = async (data: ISalary) => await Salary.create(data);
// 
export const updateSalary = async ({ id, data }: ISalaryUpdatePayload) =>
  await Salary.findByIdAndUpdate(id, data, { new: true });
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

export default {
  getSalaries,
  getSingleSalary,
  createSalary,
  updateSalary,
  deleteSalary,
};
