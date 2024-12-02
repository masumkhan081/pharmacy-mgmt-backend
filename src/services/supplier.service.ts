 
import { entities } from "../config/constants";
import Supplier from "../models/supplier.model";
import { IDType, QueryParams } from "../types/requestResponse";
import { ISupplierUpdatePayload, ISupplier } from "../types/supplier.type";
import getSearchAndPagination from "../utils/queryHandler";
//
const createSupplier = async (data: ISupplier) => await Supplier.create(data);
//
const getSingleSupplier = async (id: IDType) => Supplier.findById(id);
//
const updateSupplier = async ({ id, data }: ISupplierUpdatePayload) =>
  await Supplier.findByIdAndUpdate(id, data, { new: true });
//
const deleteSupplier = async (id: IDType) =>
  await Supplier.findByIdAndDelete(id);
//

async function getSuppliers(query: QueryParams) {
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

    const fetchResult = await Supplier.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await Supplier.countDocuments(filterConditions);
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
  getSuppliers,
  getSingleSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};
