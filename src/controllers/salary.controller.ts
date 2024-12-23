import { entities } from "../config/constants";
import salaryService from "../services/salary.service";
import { sendFetchResponse ,sendErrorResponse} from "../utils/responseHandler";
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

export const createSalary: TypeController = async (req, res) => {
  try {
    const result = await salaryService.createSalary(req.body);
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

export const updateSalary: TypeController = async (req, res) => {
  try {
    const result = await salaryService.updateSalary({
      id: req.params.id,
      data: req.body,
    });
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

export const deleteSalary: TypeController = async (req, res) => {
  try {
    const result = await salaryService.deleteSalary(req.params.id);
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

export default {
  getSalaries,
  createSalary,
  updateSalary,
  deleteSalary,
};
