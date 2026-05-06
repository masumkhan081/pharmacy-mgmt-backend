import { entities } from "../config/constants";
import Prescription from "../models/prescription.model";
import { IDType, QueryParams } from "../types/requestResponse";
import getSearchAndPagination from "../utils/queryHandler";

const createPrescription = async (data: any) => await Prescription.create(data);

const getSinglePrescription = async (id: IDType) =>
  await Prescription.findById(id)
    .populate("customer", "fullName phone")
    .populate("doctor", "fullName specialty")
    .populate("medications.drug", "name");

const updatePrescription = async ({
  id,
  data,
}: {
  id: IDType;
  data: any;
}) => await Prescription.findByIdAndUpdate(id, data, { new: true });

const deletePrescription = async (id: IDType) =>
  await Prescription.findByIdAndDelete(id);

async function getPrescriptions(query: QueryParams) {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      filterConditions,
      sortConditions,
    } = getSearchAndPagination({ query, entity: entities.prescription });

    const fetchResult = await Prescription.find(filterConditions)
      .populate("customer", "fullName")
      .populate("doctor", "fullName")
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await Prescription.countDocuments(filterConditions);
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
  createPrescription,
  getSinglePrescription,
  updatePrescription,
  deletePrescription,
  getPrescriptions,
};
