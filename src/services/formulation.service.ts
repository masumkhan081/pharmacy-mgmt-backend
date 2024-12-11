import { entities } from "../config/constants";
import Formulation from "../models/formulation.model";
import { IDType, QueryParams } from "../types/requestResponse";
import {
  IFormulation,
  IFormulationUpdatePayload,
} from "../types/formulation.type";
import getSearchAndPagination from "../utils/queryHandler";
//
const createFormulation = async (data: IFormulation) =>
  await Formulation.create(data);
//
const getSingleFormulation = async (id: IDType) => Formulation.findById(id);
//
const updateFormulation = async ({ id, data }: IFormulationUpdatePayload) =>
  await Formulation.findByIdAndUpdate(id, data, { new: true });
//
const deleteFormulation = async (id: IDType) =>
  await Formulation.findByIdAndDelete(id);
//
async function getFormulations(query: QueryParams) {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      filterConditions,
      sortConditions,
    } = getSearchAndPagination({ query, entity: entities.formulation });

    const fetchResult = await Formulation.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await Formulation.countDocuments(filterConditions);
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
  createFormulation,
  updateFormulation,
  getSingleFormulation,
  deleteFormulation,
  getFormulations,
};
