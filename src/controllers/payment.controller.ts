import { entities } from "../config/constants";
import { paymentService } from "../services";
import {
  sendFetchResponse,
  sendSingleFetchResponse,
  sendErrorResponse,
  sendCreateResponse,
  sendUpdateResponse,
  sendDeletionResponse,
} from "../utils/responseHandler";
import { TypeController } from "../types/requestResponse";

// Get all payments with pagination and filtering
export const getPayments: TypeController = async (req, res) => {
  try {
    const result = await paymentService.getPayments(req.query);
    sendFetchResponse({ res, result, entity: entities.payment });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.payment,
    });
  }
};

// Get a single payment by ID
export const getSinglePayment: TypeController = async (req, res) => {
  try {
    const result = await paymentService.getPaymentById(req.params.id);
    sendSingleFetchResponse({ res, result, entity: entities.payment });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.payment,
    });
  }
};

// Create a new payment
export const createPayment: TypeController = async (req, res) => {
  try {
    const result = await paymentService.createPayment({
      ...req.body,
      processedBy: req.user?.id, // Assuming user is attached to request by auth middleware
    });
    sendCreateResponse({ res, result, entity: entities.payment });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.payment,
    });
  }
};

// Update an existing payment
export const updatePayment: TypeController = async (req, res) => {
  try {
    const result = await paymentService.updatePayment(
      req.params.id,
      {
        ...req.body,
        updatedBy: req.user?.id, // Assuming user is attached to request by auth middleware
      }
    );
    sendUpdateResponse({ res, result, entity: entities.payment });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.payment,
    });
  }
};

// Delete a payment
export const deletePayment: TypeController = async (req, res) => {
  try {
    const result = await paymentService.deletePayment(req.params.id, req.user?.id); // Assuming user is attached to request by auth middleware
    sendDeletionResponse({ res, result, entity: entities.payment });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.payment,
    });
  }
};

// Get payments by invoice ID
export const getPaymentsByInvoice: TypeController = async (req, res) => {
  try {
    const result = await paymentService.getPaymentsByInvoice(req.params.invoiceId, req.query);
    sendFetchResponse({ res, result, entity: entities.payment });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.payment,
    });
  }
};

// Process refund for a payment
export const processRefund: TypeController = async (req, res) => {
  try {
    const result = await paymentService.processRefund({
      paymentId: req.params.id,
      amount: req.body.amount,
      reason: req.body.reason,
      processedBy: req.user?.id,
      notes: req.body.notes
    });
    sendUpdateResponse({ res, result, entity: entities.payment });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.payment,
    });
  }
};

// Get payment summary
export const getPaymentSummary: TypeController = async (req, res) => {
  try {
    const result = await paymentService.getPaymentSummary(req.query);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.payment,
    });
  }
};

export default {
  getPayments,
  getSinglePayment,
  createPayment,
  updatePayment,
  deletePayment,
  getPaymentsByInvoice,
  processRefund,
  getPaymentSummary,
};
