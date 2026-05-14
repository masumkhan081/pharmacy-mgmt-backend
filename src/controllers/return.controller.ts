import { entities } from "../config/constants";
import { returnService } from "../services";
import {
  sendFetchResponse,
  sendSingleFetchResponse,
  sendErrorResponse,
  sendCreateResponse,
  sendUpdateResponse,
  sendDeletionResponse,
} from "../utils/responseHandler";
import { TypeController } from "../types/requestResponse";

export const getReturns: TypeController = async (req, res) => {
  try {
    const result = await returnService.getReturns(req.query);
    sendFetchResponse({ res, result, entity: entities.return });
  } catch (error) {
    console.error(error);
    sendErrorResponse({ res, error, entity: entities.return });
  }
};

export const getSingleReturn: TypeController = async (req, res) => {
  try {
    const result = await returnService.getSingleReturn(req.params.id);
    sendSingleFetchResponse({ res, result, entity: entities.return });
  } catch (error) {
    console.error(error);
    sendErrorResponse({ res, error, entity: entities.return });
  }
};

export const createReturn: TypeController = async (req, res) => {
  try {
    const result = await returnService.createReturn(req.body);
    sendCreateResponse({ res, result, entity: entities.return });
  } catch (error) {
    console.error(error);
    sendErrorResponse({ res, error, entity: entities.return });
  }
};

/**
 * POST /returns/:id/approve
 * Approves a PENDING return and atomically restores inventory for CUSTOMER_RETURN.
 * Requires admin or seller role.
 */
export const approveReturn: TypeController = async (req, res) => {
  try {
    const result = await returnService.approveReturn({
      returnId: req.params.id,
      approvedBy: req.body.approvedBy,
    });
    sendUpdateResponse({ res, result, entity: entities.return });
  } catch (error) {
    console.error(error);
    sendErrorResponse({ res, error, entity: entities.return });
  }
};

/**
 * POST /returns/:id/reject
 * Rejects a PENDING return. No inventory is touched.
 */
export const rejectReturn: TypeController = async (req, res) => {
  try {
    const result = await returnService.rejectReturn({
      returnId: req.params.id,
      rejectedBy: req.body.rejectedBy,
    });
    sendUpdateResponse({ res, result, entity: entities.return });
  } catch (error) {
    console.error(error);
    sendErrorResponse({ res, error, entity: entities.return });
  }
};

export const deleteReturn: TypeController = async (req, res) => {
  try {
    const result = await returnService.deleteReturn({
      id: req.params.id,
      actor: req.user?.userId,
    });
    sendDeletionResponse({ res, result, entity: entities.return });
  } catch (error) {
    console.error(error);
    sendErrorResponse({ res, error, entity: entities.return });
  }
};

export default {
  getReturns,
  getSingleReturn,
  createReturn,
  approveReturn,
  rejectReturn,
  deleteReturn,
};

