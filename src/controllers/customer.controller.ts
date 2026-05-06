import { entities } from "../config/constants";
import customerService from "../services/customer.service";
import {
  sendFetchResponse,
  sendSingleFetchResponse,
  sendErrorResponse,
  sendCreateResponse,
  sendUpdateResponse,
  sendDeletionResponse,
} from "../utils/responseHandler";
import { TypeController } from "../types/requestResponse";

export const getCustomers: TypeController = async (req, res) => {
  try {
    const result = await customerService.getCustomers(req.query);
    sendFetchResponse({ res, result, entity: entities.customer });
  } catch (error) {
    console.error(error);
    sendErrorResponse({ res, error, entity: entities.customer });
  }
};

export const getSingleCustomer: TypeController = async (req, res) => {
  try {
    const result = await customerService.getSingleCustomer(req.params.id);
    sendSingleFetchResponse({ res, result, entity: entities.customer });
  } catch (error) {
    sendErrorResponse({ res, error, entity: entities.customer });
  }
};

export const createCustomer: TypeController = async (req, res) => {
  try {
    const result = await customerService.createCustomer(req.body);
    sendCreateResponse({ res, result, entity: entities.customer });
  } catch (error) {
    sendErrorResponse({ res, error, entity: entities.customer });
  }
};

export const updateCustomer: TypeController = async (req, res) => {
  try {
    const result = await customerService.updateCustomer({
      id: req.params.id,
      data: req.body,
    });
    sendUpdateResponse({ res, result, entity: entities.customer });
  } catch (error) {
    sendErrorResponse({ res, error, entity: entities.customer });
  }
};

export const deleteCustomer: TypeController = async (req, res) => {
  try {
    const result = await customerService.deleteCustomer(req.params.id);
    sendDeletionResponse({ res, result, entity: entities.customer });
  } catch (error) {
    sendErrorResponse({ res, error, entity: entities.customer });
  }
};
