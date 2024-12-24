import { entities } from "../config/constants";
import attendanceService from "../services/attendance.service";
import {
  sendFetchResponse,
  sendSingleFetchResponse,
  sendErrorResponse,
  sendCreateResponse,
  sendUpdateResponse,
  sendDeletionResponse
} from "../utils/responseHandler";
import { TypeController } from "../types/requestResponse";
//
export const getAttendances: TypeController = async (req, res) => {
  try {
    const result = await attendanceService.getAttendances(req.query);
    sendFetchResponse({ res, result, entity: entities.attendance });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.attendance,
    });
  }
};

export const getSingleAttendance: TypeController = async (req, res) => {
  try {
    const result = await attendanceService.getSingleAttendance(req.params.id);
    sendSingleFetchResponse({ res, result, entity: entities.attendance });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.attendance,
    });
  }
};

export const createAttendance: TypeController = async (req, res) => {
  try {
    const result = await attendanceService.createAttendance(req.body);
    sendCreateResponse({ res, result, entity: entities.attendance });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.attendance,
    });
  }
};

export const updateAttendance: TypeController = async (req, res) => {
  try {
    const result = await attendanceService.updateAttendance({
      id: req.params.id,
      data: req.body,
    });
    sendUpdateResponse({ res, result, entity: entities.attendance });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.attendance,
    });
  }
};

export const deleteAttendance: TypeController = async (req, res) => {
  try {
    const result = await attendanceService.deleteAttendance(req.params.id);
    sendDeletionResponse({ res, result, entity: entities.attendance });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.attendance,
    });
  }
};

export default {
  getAttendances,
  getSingleAttendance,
  createAttendance,
  updateAttendance,
  deleteAttendance,
};
