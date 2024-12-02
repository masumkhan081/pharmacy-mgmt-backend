 
import { entities } from "../config/constants";
import Unit from "../models/unit.model";
import { IDType, QueryParams } from "../types/requestResponse";
import { IUnit, IUnitUpdatePayload } from "../types/unit.type";
import getSearchAndPagination from "../utils/queryHandler";
//
const createUnit = async (data: IUnit) => await Unit.create(data);
//
const getSingleUnit = async (id: IDType) => Unit.findById(id);
//
const updateUnit = async ({ id, data }: IUnitUpdatePayload) =>
  await Unit.findByIdAndUpdate(id, data, { new: true });
//
const deleteUnit = async (id: IDType) => await Unit.findByIdAndDelete(id);
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

export default {
  createUnit,
  updateUnit,
  getSingleUnit,
  deleteUnit,
  getUnits,
};
