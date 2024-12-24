import { entities } from "../config/constants";
import salaryService from "../services/salary.service";
import { sendFetchResponse, sendUpdateResponse, sendErrorResponse, sendDeletionResponse, sendSingleFetchResponse, sendCreateResponse } from "../utils/responseHandler";
import { TypeController } from "../types/requestResponse";
//

export const getSalaries: TypeController = async (req, res) => {
  try {
    const result = await salaryService.getSalaries(req.query);
    sendFetchResponse({ res, result, entity: entities.salary });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.unit,
    });
  }
};

export const getSingleSalary: TypeController = async (req, res) => {
  try {
    const result = await salaryService.getSingleSalary(req.params.id);
    sendSingleFetchResponse({ res, result, entity: entities.salary });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.unit,
    });
  }
};

export const createSalary: TypeController = async (req, res) => {
  try {
    const result = await salaryService.createSalary(req.body);
    sendCreateResponse({ res, result, entity: entities.salary });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.unit,
    });
  }
};

export const updateSalary: TypeController = async (req, res) => {
  try {
    const result = await salaryService.updateSalary({
      id: req.params.id,
      data: req.body,
    });
    sendUpdateResponse({ res, result, entity: entities.salary });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.unit,
    });
  }
};
// 
export const deleteSalary: TypeController = async (req, res) => {
  try {
    const result = await salaryService.deleteSalary(req.params.id);
    sendDeletionResponse({ res, result, entity: entities.salary });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.unit,
    });
  }
};

export default {
  getSalaries,
  getSingleSalary,
  createSalary,
  updateSalary,
  deleteSalary,
};
