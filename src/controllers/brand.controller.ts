import { entities } from "../config/constants";
import brandService from "../services/brand.service";
import { sendFetchResponse,sendErrorResponse } from "../utils/responseHandler";
import { TypeController } from "../types/requestResponse";
//

export const getBrands: TypeController = async (req, res) => {
  try {
    const result = await brandService.getBrands(req.query);
    sendFetchResponse({ res, result, entity: entities.brand });
  } catch (error) {
    console.error(error);
     sendErrorResponse({
       res,
       error,
       entity: entities.unit,
     });
  }
};

export const getSingleBrand: TypeController = async (req, res) => {
  try {
    const result = await brandService.getSingleBrand(req.params.id);
    sendFetchResponse({ res, result, entity: entities.brand });
  } catch (error) {
    console.error(error);
     sendErrorResponse({
       res,
       error,
       entity: entities.unit,
     });
  }
};

export const createBrand: TypeController = async (req, res) => {
  try {
    const result = await brandService.createBrand(req.body);
    sendFetchResponse({ res, result, entity: entities.brand });
  } catch (error) {
    console.error(error);
     sendErrorResponse({
       res,
       error,
       entity: entities.unit,
     });
  }
};

export const updateBrand: TypeController = async (req, res) => {
  try {
    const result = await brandService.updateBrand({
      id: req.params.id,
      data: req.body,
    });
    sendFetchResponse({ res, result, entity: entities.brand });
  } catch (error) {
    console.error(error);
     sendErrorResponse({
       res,
       error,
       entity: entities.unit,
     });
  }
};

export const deleteBrand: TypeController = async (req, res) => {
  try {
    const result = await brandService.deleteBrand(req.params.id);
    sendFetchResponse({ res, result, entity: entities.brand });
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
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
};
