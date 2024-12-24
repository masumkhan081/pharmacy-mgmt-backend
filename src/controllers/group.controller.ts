import { entities } from "../config/constants";
import groupService from "../services/group.service";
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

export const getGroups: TypeController = async (req, res) => {
  try {
    const result = await groupService.getGroups(req.query);
    sendFetchResponse({ res, result, entity: entities.group });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.unit,
    });
  }
};

export const getSingleGroup: TypeController = async (req, res) => {
  try {
    const result = await groupService.getSingleGroup(req.params.id);
    sendSingleFetchResponse({ res, result, entity: entities.group });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.unit,
    });
  }
};

export const createGroup: TypeController = async (req, res) => {
  try {
    const result = await groupService.createGroup(req.body);
    sendCreateResponse({ res, result, entity: entities.group });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.unit,
    });
  }
};

export const updateGroup: TypeController = async (req, res) => {
  try {
    const result = await groupService.updateGroup({
      id: req.params.id,
      data: req.body,
    });
    sendUpdateResponse({ res, result, entity: entities.group });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.unit,
    });
  }
};

export const deleteGroup: TypeController = async (req, res) => {
  try {
    const result = await groupService.deleteGroup(req.params.id);
    sendDeletionResponse({ res, result, entity: entities.group });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.unit,
    });
  }
};

export default {
  getGroups,
  getSingleGroup,
  createGroup,
  updateGroup,
  deleteGroup,
};
