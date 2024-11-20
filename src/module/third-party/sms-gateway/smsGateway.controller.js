const smsGatewayService = require("./smsGateway.service");
const httpStatus = require("http-status");

const {
  sendCreateResponse,
  sendDeletionResponse,
  sendErrorResponse,
  sendFetchResponse,
  sendUpdateResponse,
} = require("../../../utils/responseHandler");
const { operableEntities } = require("../../../config/constants");

async function createSmsGateway(req, res) {
  const result = await smsGatewayService.createSmsGateway(req.body);
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.sms_gateway,
    });
  } else {
    sendCreateResponse({
      res,
      data: result,
      what: operableEntities.sms_gateway,
    });
  }
}

async function getSmsGateway(req, res) {
  const result = await smsGatewayService.getSmsGateway(req.query);
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.sms_gateway,
    });
  } else {
    sendFetchResponse({
      res,
      data: result,
      what: operableEntities.sms_gateway,
    });
  }
}
//
async function updateSmsGateway(req, res) {
  const result = await smsGatewayService.updateSmsGateway({
    id: req.params.id,
    data: req.body,
  });
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.sms_gateway,
    });
  } else {
    sendUpdateResponse({
      res,
      data: result,
      what: operableEntities.sms_gateway,
    });
  }
}
//
async function deleteSmsGateway(req, res) {
  const result = await smsGatewayService.deleteSmsGateway(req.params.id);
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.sms_gateway,
    });
  } else {
    sendDeletionResponse({
      res,
      data: result,
      what: operableEntities.sms_gateway,
    });
  }
}
//
module.exports = {
  createSmsGateway,
  updateSmsGateway,
  deleteSmsGateway,
  getSmsGateway,
};
