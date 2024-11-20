const returnRefundService = require("./returnRefund.service");
const httpStatus = require("http-status");
const { promisify } = require("util");
const fs = require("fs");
const path = require("path");
const unlinkAsync = promisify(fs.unlink);
const ReturnRefund = require("./returnRefund.model");

const {
  sendCreateResponse,
  sendDeletionResponse,
  sendErrorResponse,
  sendFetchResponse,
  sendUpdateResponse,
} = require("../../../utils/responseHandler");
const { operableEntities } = require("../../../config/constants");

async function createReturnRefund(req, res) {
  const result = await returnRefundService.createReturnRefund(req.body);
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.return_and_refund_policy,
    });
  } else {
    sendCreateResponse({
      res,
      data: result,
      what: operableEntities.return_and_refund_policy,
    });
  }
}

async function getReturnRefunds(req, res) {
  const result = await returnRefundService.getReturnRefund(req.query);
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.return_and_refund_policy,
    });
  } else {
    sendFetchResponse({
      res,
      data: result,
      what: operableEntities.return_and_refund_policy,
    });
  }
}
//

async function updateReturnRefund(req, res) {
  const result = await returnRefundService.updateReturnRefund({
    id: req.params.id,
    data: req.body,
  });
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.return_and_refund_policy,
    });
  } else {
    sendUpdateResponse({
      res,
      data: result,
      what: operableEntities.return_and_refund_policy,
    });
  }
}
//
async function deleteReturnRefund(req, res) {
  const result = await returnRefundService.de(req.params.id);
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.return_and_refund_policy,
    });
  } else {
    sendDeletionResponse({
      res,
      data: result,
      what: operableEntities.return_and_refund_policy,
    });
  }
}
//
module.exports = {
  createReturnRefund,
  updateReturnRefund,
  deleteReturnRefund,
  getReturnRefunds,
};
