 
import { entities } from "../config/constants";
import Staff from "../models/staff.model";
import { IDType, QueryParams } from "../types/requestResponse";
import { IStaff, IStaffUpdatePayload } from "../types/staff.type";
import getSearchAndPagination from "../utils/queryHandler";
//
const createStaff = async (data: IStaff) => await Staff.create(data);
//
const getSingleStaff = async (id: IDType) => Staff.findById(id);
//
const updateStaff = async ({ id, data }: IStaffUpdatePayload) =>
  await Staff.findByIdAndUpdate(id, data, { new: true });
//
const deleteStaff = async (id: IDType) => await Staff.findByIdAndDelete(id);
//
async function getStaffs(query: QueryParams) {
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

    const fetchResult = await Staff.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await Staff.countDocuments(filterConditions);
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
  createStaff,
  updateStaff,
  getSingleStaff,
  deleteStaff,
  getStaffs,
};
