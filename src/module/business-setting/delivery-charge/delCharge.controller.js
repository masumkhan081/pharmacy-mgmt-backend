const delChargeService = require("./delCharge.service");
const httpStatus = require("http-status");

const {
  sendCreateResponse,
  sendDeletionResponse,
  sendErrorResponse,
  sendFetchResponse,
  sendUpdateResponse,
} = require("../../../utils/responseHandler");
const { operableEntities } = require("../../../config/constants");
//
async function createDeliveryCharge(req, res) {
  const result = await delChargeService.createDeliveryCharge(req.body);
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.delivery_charge,
    });
  } else {
    sendCreateResponse({
      res,
      data: result,
      what: operableEntities.delivery_charge,
    });
  }
}

async function getDeliveryCharges(req, res) {
  const result = await delChargeService.getDeliveryCharges(req.query);
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.delivery_charge,
    });
  } else {
    sendFetchResponse({
      res,
      data: result,
      what: operableEntities.delivery_charge,
    });
  }
}
//
async function updateDeliveryCharge(req, res) {
  const result = await delChargeService.updateDeliveryCharge({
    id: req.params.id,
    data: req.body,
  });
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.delivery_charge,
    });
  } else {
    sendUpdateResponse({
      res,
      data: result,
      what: operableEntities.delivery_charge,
    });
  }
}
//
async function deleteDeliveryCharge(req, res) {
  const result = await delChargeService.deleteDeliveryCharge(req.params.id);
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.delivery_charge,
    });
  } else {
    sendDeletionResponse({
      res,
      data: result,
      what: operableEntities.delivery_charge,
    });
  }
}
//
module.exports = {
  createDeliveryCharge,
  updateDeliveryCharge,
  deleteDeliveryCharge,
  getDeliveryCharges,
};
