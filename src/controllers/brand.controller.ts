import { entities } from "../config/constants";
import brandService from "../services/brand.service";
import {
  sendFetchResponse,
  sendSingleFetchResponse,
  sendErrorResponse,
  sendCreateResponse,
  sendUpdateResponse,
  sendDeletionResponse,
  sendBadRequest,
} from "../utils/responseHandler";
import { TypeController } from "../types/requestResponse";
import Manufacturer from "../models/mfr.model";
import Generic from "../models/generic.model";
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
      entity: entities.brand,
    });
  }
};

export const getSingleBrand: TypeController = async (req, res) => {
  try {
    const result = await brandService.getSingleBrand(req.params.id);
    sendSingleFetchResponse({ res, result, entity: entities.brand });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.brand,
    });
  }
};

export const createBrand: TypeController = async (req, res) => {
  try {
    const genericExists = await Generic.findById(req.body.generic);
    if (!genericExists) {
      return sendBadRequest({ res, message: "Invalid generic reference" });
    }

    const manufacturerExists = await Manufacturer.findById(req.body.manufacturer);
    if (!manufacturerExists) {
      return sendBadRequest({ res, message: "Invalid manufacturer reference" });
    }

    const result = await brandService.createBrand(req.body);
    sendCreateResponse({ res, result, entity: entities.brand });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.brand,
    });
  }
};
// 
export const updateBrand: TypeController = async (req, res) => {
  try {

    if (req.body.generic && !(await Generic.findById(req.body.generic))) {
      return sendBadRequest({ res, message: "Invalid generic reference" });
    }

    if (req.body.manufacturer && !(await Manufacturer.findById(req.body.manufacturer))) {
      return sendBadRequest({ res, message: "Invalid manufacturer reference" });
    }

    const result = await brandService.updateBrand({
      id: req.params.id,
      data: req.body,
    });
    sendUpdateResponse({ res, result, entity: entities.brand });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.brand,
    });
  }
};
// 
export const deleteBrand: TypeController = async (req, res) => {
  try {
    const result = await brandService.deleteBrand(req.params.id);
    sendDeletionResponse({ res, result, entity: entities.brand });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.brand,
    });
  }
};

export default {
  getBrands,
  getSingleBrand,
  createBrand,
  updateBrand,
  deleteBrand,
};
