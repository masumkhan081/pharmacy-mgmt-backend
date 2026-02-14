import { entities } from "../config/constants";
import { invoiceService } from "../services";
import {
  sendFetchResponse,
  sendSingleFetchResponse,
  sendErrorResponse,
  sendCreateResponse,
  sendUpdateResponse,
  sendDeletionResponse,
} from "../utils/responseHandler";
import { TypeController } from "../types/requestResponse";

// Get all invoices with pagination and filtering
export const getInvoices: TypeController = async (req, res) => {
  try {
    const result = await invoiceService.getInvoices(req.query);
    sendFetchResponse({ res, result, entity: entities.invoice });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.invoice,
    });
  }
};

// Get a single invoice by ID
export const getSingleInvoice: TypeController = async (req, res) => {
  try {
    const result = await invoiceService.getSingleInvoice(req.params.id);
    sendSingleFetchResponse({ res, result, entity: entities.invoice });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.invoice,
    });
  }
};

// Create a new invoice
export const createInvoice: TypeController = async (req, res) => {
  try {
    const result = await invoiceService.createInvoice(req.body);
    sendCreateResponse({ res, result, entity: entities.invoice });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.invoice,
    });
  }
};

// Update an existing invoice
export const updateInvoice: TypeController = async (req, res) => {
  try {
    const result = await invoiceService.updateInvoice({
      id: req.params.id,
      data: req.body,
    });
    sendUpdateResponse({ res, result, entity: entities.invoice });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.invoice,
    });
  }
};

// Delete an invoice
export const deleteInvoice: TypeController = async (req, res) => {
  try {
    const result = await invoiceService.deleteInvoice(req.params.id);
    sendDeletionResponse({ res, result, entity: entities.invoice });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.invoice,
    });
  }
};

// Get invoices by customer ID
export const getInvoicesByCustomer: TypeController = async (req, res) => {
  try {
    const result = await invoiceService.getInvoicesByCustomer({
      customerId: req.params.customerId,
      query: req.query,
    });
    sendFetchResponse({ res, result, entity: entities.invoice });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.invoice,
    });
  }
};

// Update invoice status
export const updateInvoiceStatus: TypeController = async (req, res) => {
  try {
    const result = await invoiceService.updateInvoiceStatus({
      id: req.params.id,
      status: req.body.status,
      updatedBy: req.body.updatedBy,
    });
    sendUpdateResponse({ res, result, entity: entities.invoice });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.invoice,
    });
  }
};

export default {
  getInvoices,
  getSingleInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  getInvoicesByCustomer,
  updateInvoiceStatus,
};
