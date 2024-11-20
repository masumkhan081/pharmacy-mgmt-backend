const shippingDeliveryPolicyService = require("./shippingDelivery.service");
const httpStatus = require("http-status");
const {
  sendCreateResponse,
  sendDeletionResponse,
  sendErrorResponse,
  sendFetchResponse,
  sendUpdateResponse,
} = require("../../../utils/responseHandler");
const { operableEntities } = require("../../../config/constants");
const {
  isPatchBodyValid,
  isPostBodyValid,
} = require("./shippingDelivery.validate");

async function createShippingDeliveryPolicy() {
  const result =
    await shippingDeliveryPolicyService.createShippingDeliveryPolicy(req.body);
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.shipping_and_delivery_policy,
    });
  } else {
    sendCreateResponse({
      res,
      data: result,
      what: operableEntities.shipping_and_delivery_policy,
    });
  }
}

async function getShippingDeliveryPolicy(req, res) {
  const result = await shippingDeliveryPolicyService.getShippingDeliveryPolicy(
    req.query
  );
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.shipping_and_delivery_policy,
    });
  } else {
    sendFetchResponse({
      res,
      data: result,
      what: operableEntities.shipping_and_delivery_policy,
    });
  }
}
//
async function updateShippingDeliveryPolicy(req, res) {
  const result =
    await shippingDeliveryPolicyService.updateShippingDeliveryPolicy({
      id: req.params.id,
      data: req.body,
    });
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.shipping_and_delivery_policy,
    });
  } else {
    sendUpdateResponse({
      res,
      data: result,
      what: operableEntities.shipping_and_delivery_policy,
    });
  }
}
//
async function deleteShippingDeliveryPolicy(req, res) {
  const result =
    await shippingDeliveryPolicyService.deleteShippingDeliveryPolicy(
      req.params.id
    );
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.shipping_and_delivery_policy,
    });
  } else {
    sendDeletionResponse({
      res,
      data: result,
      what: operableEntities.shipping_and_delivery_policy,
    });
  }
}
//
module.exports = {
  createShippingDeliveryPolicy,
  updateShippingDeliveryPolicy,
  deleteShippingDeliveryPolicy,
  getShippingDeliveryPolicy,
};
