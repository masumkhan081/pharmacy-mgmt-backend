import { entities } from "../config/constants";
import prescriptionService from "../services/prescription.service";
import {
  sendFetchResponse,
  sendSingleFetchResponse,
  sendErrorResponse,
  sendCreateResponse,
  sendUpdateResponse,
  sendDeletionResponse,
} from "../utils/responseHandler";
import { TypeController } from "../types/requestResponse";

export const getPrescriptions: TypeController = async (req, res) => {
  try {
    const result = await prescriptionService.getPrescriptions(req.query);
    sendFetchResponse({ res, result, entity: entities.prescription });
  } catch (error) {
    console.error(error);
    sendErrorResponse({ res, error, entity: entities.prescription });
  }
};

export const getSinglePrescription: TypeController = async (req, res) => {
  try {
    const result = await prescriptionService.getSinglePrescription(
      req.params.id
    );
    sendSingleFetchResponse({ res, result, entity: entities.prescription });
  } catch (error) {
    sendErrorResponse({ res, error, entity: entities.prescription });
  }
};

export const createPrescription: TypeController = async (req, res) => {
  try {
    const result = await prescriptionService.createPrescription(req.body);
    sendCreateResponse({ res, result, entity: entities.prescription });
  } catch (error) {
    sendErrorResponse({ res, error, entity: entities.prescription });
  }
};

export const updatePrescription: TypeController = async (req, res) => {
  try {
    const result = await prescriptionService.updatePrescription({
      id: req.params.id,
      data: req.body,
    });
    sendUpdateResponse({ res, result, entity: entities.prescription });
  } catch (error) {
    sendErrorResponse({ res, error, entity: entities.prescription });
  }
};

export const deletePrescription: TypeController = async (req, res) => {
  try {
    const result = await prescriptionService.deletePrescription(req.params.id);
    sendDeletionResponse({ res, result, entity: entities.prescription });
  } catch (error) {
    sendErrorResponse({ res, error, entity: entities.prescription });
  }
};
