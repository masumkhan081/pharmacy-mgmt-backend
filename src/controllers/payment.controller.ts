import { entities } from "../config/constants";
import { paymentService } from "../services";
import {
  sendFetchResponse,
  sendSingleFetchResponse,
  sendErrorResponse,
  sendCreateResponse,
} from "../utils/responseHandler";
import { TypeController } from "../types/requestResponse";

export const getPayments: TypeController = async (req, res) => {
  try {
    const result = await paymentService.getPayments(req.query);
    sendFetchResponse({ res, result, entity: entities.payment });
  } catch (error) {
    console.error(error);
    sendErrorResponse({ res, error, entity: entities.payment });
  }
};

export const getSinglePayment: TypeController = async (req, res) => {
  try {
    const result = await paymentService.getPaymentById(req.params.id);
    sendSingleFetchResponse({ res, result, entity: entities.payment });
  } catch (error) {
    console.error(error);
    sendErrorResponse({ res, error, entity: entities.payment });
  }
};

export const createPayment: TypeController = async (req, res) => {
  try {
    const result = await paymentService.createPayment({
      ...req.body,
      processedBy: req.user?.userId,
    });
    sendCreateResponse({ res, result, entity: entities.payment });
  } catch (error) {
    console.error(error);
    sendErrorResponse({ res, error, entity: entities.payment });
  }
};

export const getPaymentsByInvoice: TypeController = async (req, res) => {
  try {
    const result = await paymentService.getPaymentsByInvoice(req.params.invoiceId);
    sendFetchResponse({ res, result, entity: entities.payment });
  } catch (error) {
    console.error(error);
    sendErrorResponse({ res, error, entity: entities.payment });
  }
};

export default {
  getPayments,
  getSinglePayment,
  createPayment,
  getPaymentsByInvoice,
};
