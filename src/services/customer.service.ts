import { entities } from "../config/constants";
import Customer from "../models/customer.model";
import { IDType, QueryParams } from "../types/requestResponse";
import getSearchAndPagination from "../utils/queryHandler";

const createCustomer = async (data: any) => await Customer.create(data);

const getSingleCustomer = async (id: IDType) => Customer.findById(id);

const updateCustomer = async ({ id, data }: { id: IDType; data: any }) =>
  await Customer.findByIdAndUpdate(id, data, { new: true });

const deleteCustomer = async (id: IDType) =>
  await Customer.findByIdAndDelete(id);

async function getCustomers(query: QueryParams) {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      filterConditions,
      sortConditions,
    } = getSearchAndPagination({ query, entity: entities.customer });

    const fetchResult = await Customer.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await Customer.countDocuments(filterConditions);
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
  createCustomer,
  getSingleCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomers,
};
