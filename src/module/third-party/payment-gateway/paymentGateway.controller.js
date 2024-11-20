const paymentGatewayService = require("./paymentGateway.service");
const httpStatus = require("http-status");

const {
  sendCreateResponse,
  sendDeletionResponse,
  sendErrorResponse,
  sendFetchResponse,
  sendUpdateResponse,
} = require("../../../utils/responseHandler");
const { operableEntities } = require("../../../config/constants");

async function createPaymentGateway(req, res) {
  const result = await paymentGatewayService.createPaymentGateway(req.body);
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.payment_gateway,
    });
  } else {
    sendCreateResponse({
      res,
      data: result,
      what: operableEntities.payment_gateway,
    });
  }
}

async function getPaymentGateway(req, res) {
  const result = await paymentGatewayService.getPaymentGateway(req.query);
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.payment_gateway,
    });
  } else {
    sendFetchResponse({
      res,
      data: result,
      what: operableEntities.payment_gateway,
    });
  }
}
//
async function updatePaymentGateway(req, res) {
  const result = await paymentGatewayService.updatePaymentGateway({
    id: req.params.id,
    data: req.body,
  });
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.payment_gateway,
    });
  } else {
    sendUpdateResponse({
      res,
      data: result,
      what: operableEntities.payment_gateway,
    });
  }
}
//
async function deletePaymentGateway(req, res) {
  const result = await paymentGatewayService.deletePaymentGateway(
    req.params.id
  );
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.payment_gateway,
    });
  } else {
    sendDeletionResponse({
      res,
      data: result,
      what: operableEntities.payment_gateway,
    });
  }
}
//
module.exports = {
  createPaymentGateway,
  updatePaymentGateway,
  deletePaymentGateway,
  getPaymentGateway,
};
