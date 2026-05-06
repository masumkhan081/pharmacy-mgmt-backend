import { entities } from "../config/constants";
import Doctor from "../models/doctor.model";
import { IDType, QueryParams } from "../types/requestResponse";
import getSearchAndPagination from "../utils/queryHandler";

const createDoctor = async (data: any) => await Doctor.create(data);

const getSingleDoctor = async (id: IDType) => Doctor.findById(id);

const updateDoctor = async ({ id, data }: { id: IDType; data: any }) =>
  await Doctor.findByIdAndUpdate(id, data, { new: true });

const deleteDoctor = async (id: IDType) => await Doctor.findByIdAndDelete(id);

async function getDoctors(query: QueryParams) {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      filterConditions,
      sortConditions,
    } = getSearchAndPagination({ query, entity: entities.doctor });

    const fetchResult = await Doctor.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await Doctor.countDocuments(filterConditions);
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
  createDoctor,
  getSingleDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctors,
};
