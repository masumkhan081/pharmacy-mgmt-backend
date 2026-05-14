import { entities } from "../config/constants";
import { invoiceService } from "../services";
import {
  sendFetchResponse,
  sendSingleFetchResponse,
  sendErrorResponse,
  sendCreateResponse,
  sendDeletionResponse,
} from "../utils/responseHandler";
import { TypeController } from "../types/requestResponse";

export const getInvoices: TypeController = async (req, res) => {
  try {
    const result = await invoiceService.getInvoices(req.query);
    sendFetchResponse({ res, result, entity: entities.invoice });
  } catch (error) {
    console.error(error);
    sendErrorResponse({ res, error, entity: entities.invoice });
  }
};

export const getSingleInvoice: TypeController = async (req, res) => {
  try {
    const result = await invoiceService.getSingleInvoice(req.params.id);
    sendSingleFetchResponse({ res, result, entity: entities.invoice });
  } catch (error) {
    console.error(error);
    sendErrorResponse({ res, error, entity: entities.invoice });
  }
};

export const createInvoice: TypeController = async (req, res) => {
  try {
    const result = await invoiceService.createInvoice(req.body);
    sendCreateResponse({ res, result, entity: entities.invoice });
  } catch (error) {
    console.error(error);
    sendErrorResponse({ res, error, entity: entities.invoice });
  }
};

export const deleteInvoice: TypeController = async (req, res) => {
  try {
    const result = await invoiceService.deleteInvoice({
      id: req.params.id,
      actor: req.user?.userId,
    });
    sendDeletionResponse({ res, result, entity: entities.invoice });
  } catch (error) {
    console.error(error);
    sendErrorResponse({ res, error, entity: entities.invoice });
  }
};

export default {
  getInvoices,
  getSingleInvoice,
  createInvoice,
  deleteInvoice,
};
