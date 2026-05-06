import { entities } from "../config/constants";
import doctorService from "../services/doctor.service";
import {
  sendFetchResponse,
  sendSingleFetchResponse,
  sendErrorResponse,
  sendCreateResponse,
  sendUpdateResponse,
  sendDeletionResponse,
} from "../utils/responseHandler";
import { TypeController } from "../types/requestResponse";

export const getDoctors: TypeController = async (req, res) => {
  try {
    const result = await doctorService.getDoctors(req.query);
    sendFetchResponse({ res, result, entity: entities.doctor });
  } catch (error) {
    console.error(error);
    sendErrorResponse({ res, error, entity: entities.doctor });
  }
};

export const getSingleDoctor: TypeController = async (req, res) => {
  try {
    const result = await doctorService.getSingleDoctor(req.params.id);
    sendSingleFetchResponse({ res, result, entity: entities.doctor });
  } catch (error) {
    sendErrorResponse({ res, error, entity: entities.doctor });
  }
};

export const createDoctor: TypeController = async (req, res) => {
  try {
    const result = await doctorService.createDoctor(req.body);
    sendCreateResponse({ res, result, entity: entities.doctor });
  } catch (error) {
    sendErrorResponse({ res, error, entity: entities.doctor });
  }
};

export const updateDoctor: TypeController = async (req, res) => {
  try {
    const result = await doctorService.updateDoctor({
      id: req.params.id,
      data: req.body,
    });
    sendUpdateResponse({ res, result, entity: entities.doctor });
  } catch (error) {
    sendErrorResponse({ res, error, entity: entities.doctor });
  }
};

export const deleteDoctor: TypeController = async (req, res) => {
  try {
    const result = await doctorService.deleteDoctor(req.params.id);
    sendDeletionResponse({ res, result, entity: entities.doctor });
  } catch (error) {
    sendErrorResponse({ res, error, entity: entities.doctor });
  }
};
