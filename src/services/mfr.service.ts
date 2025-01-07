 
import { entities } from "../config/constants";
import Manufacturer from "../models/mfr.model";
import { IDType, QueryParams } from "../types/requestResponse";
import { IManufacturer, IManufacturerUpdatePayload } from "../types/mfr.type";
import getSearchAndPagination from "../utils/queryHandler";
 //
const createManufacturer = async (data: IManufacturer) => await Manufacturer.create(data);
//
const getSingleManufacturer = async (id: IDType) => Manufacturer.findById(id);
//
const updateManufacturer = async ({ id, data }: IManufacturerUpdatePayload) =>
  await Manufacturer.findByIdAndUpdate(id, data, { new: true });
//
const deleteManufacturer = async (id: IDType) => await Manufacturer.findByIdAndDelete(id);
//
async function getManufacturers(query: QueryParams) {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      filterConditions,
      sortConditions,
    } = getSearchAndPagination({ query, entity: entities.manufacturer });

    const fetchResult = await Manufacturer.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await Manufacturer.countDocuments(filterConditions);
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
  createManufacturer,
  updateManufacturer,
  getSingleManufacturer,
  deleteManufacturer,
  getManufacturers,
};