import { entities } from "../config/constants";
import groupService from "../services/group.service";
import { sendFetchResponse, sendErrorResponse } from "../utils/responseHandler";
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

export const createGroup: TypeController = async (req, res) => {
  try {
    const result = await groupService.createGroup(req.body);
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

export const updateGroup: TypeController = async (req, res) => {
  try {
    const result = await groupService.updateGroup({
      id: req.params.id,
      data: req.body,
    });
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

export const deleteGroup: TypeController = async (req, res) => {
  try {
    const result = await groupService.deleteGroup(req.params.id);
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

export default {
  getGroups,
  createGroup,
  updateGroup,
  deleteGroup,
};
