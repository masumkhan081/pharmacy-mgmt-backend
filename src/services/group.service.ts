import { entities } from "../config/constants";
import Group from "../models/group.model";
import { IDType, QueryParams } from "../types/requestResponse";
import { Igroup, IgroupUpdatePayload } from "../types/group.type";
import getSearchAndPagination from "../utils/queryHandler";
//
const createGroup = async (data: Igroup) => await Group.create(data);
//
const getSingleGroup = async (id: IDType) => Group.findById(id);
//
const updateGroup = async ({ id, data }: IgroupUpdatePayload) =>
  await Group.findByIdAndUpdate(id, data, { new: true });
//
const deleteGroup = async (id: IDType) => await Group.findByIdAndDelete(id);
//
async function getGroups(query: QueryParams) {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      filterConditions,
      sortConditions,
    } = getSearchAndPagination({ query, entity: entities.group });

    const fetchResult = await Group.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await Group.countDocuments(filterConditions);
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
  createGroup,
  updateGroup,
  getSingleGroup,
  deleteGroup,
  getGroups,
};
