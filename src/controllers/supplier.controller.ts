import { entities } from "../config/constants";
import supplierService from "../services/supplier.service";
import { sendErrorResponse, sendFetchResponse } from "../utils/responseHandler";
import { TypeController } from "../types/requestResponse";
//

export const getSuppliers: TypeController = async (req, res) => {
  try {
    const result = await supplierService.getSuppliers(req.query);
    sendFetchResponse({ res, result, entity: entities.supplier });
  } catch (error) {
    console.error(error);
     sendErrorResponse({
       res,
       error,
       entity: entities.unit,
     });
  }
};

export const getSingleSupplier: TypeController = async (req, res) => {
  try {
    const result = await supplierService.getSingleSupplier(req.params.id);
    sendFetchResponse({ res, result, entity: entities.supplier });
  } catch (error) {
    console.error(error);
     sendErrorResponse({
       res,
       error,
       entity: entities.unit,
     });
  }
};

export const createSupplier: TypeController = async (req, res) => {
  try {
    const result = await supplierService.createSupplier(req.body);
    sendFetchResponse({ res, result, entity: entities.supplier });
  } catch (error) {
    console.error(error);
     sendErrorResponse({
       res,
       error,
       entity: entities.unit,
     });
  }
};

export const updateSupplier: TypeController = async (req, res) => {
  try {
    const result = await supplierService.updateSupplier({
      id: req.params.id,
      data: req.body,
    });
    sendFetchResponse({ res, result, entity: entities.supplier });
  } catch (error) {
    console.error(error);
     sendErrorResponse({
       res,
       error,
       entity: entities.unit,
     });
  }
};

export const deleteSupplier: TypeController = async (req, res) => {
  try {
    const result = await supplierService.deleteSupplier(req.params.id);
    sendFetchResponse({ res, result, entity: entities.supplier });
  } catch (error) {
    console.error(error);
     sendErrorResponse({
       res,
       error,
       entity: entities.unit,
     });
  }
};

