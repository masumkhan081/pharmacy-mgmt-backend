const businessSetupService = require("./businessSetup.service");
const httpStatus = require("http-status");

const {
  sendCreateResponse,
  sendDeletionResponse,
  sendErrorResponse,
  sendFetchResponse,
  sendUpdateResponse,
} = require("../../../utils/responseHandler");
const { operableEntities } = require("../../../config/constants");

async function createBusinessSetup(req, res) {
  const result = await businessSetupService.createBusinessSetup(req.body);
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.business_setup,
    });
  } else {
    sendCreateResponse({
      res,
      data: result,
      what: operableEntities.business_setup,
    });
  }
}

async function getBusinessSetup(req, res) {
  const result = await businessSetupService.getBusinessSetup(req.query);
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.business_setup,
    });
  } else {
    sendFetchResponse({
      res,
      data: result,
      what: operableEntities.business_setup,
    });
  }
}
//
async function updateBusinessSetup(req, res) {
  const result = await businessSetupService.updateBusinessSetup({
    id: req.params.id,
    data: req.body,
  });
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.business_setup,
    });
  } else {
    sendUpdateResponse({
      res,
      data: result,
      what: operableEntities.business_setup,
    });
  }
}
//
async function deleteBusinessSetup(req, res) {
  const result = await businessSetupService.deleteBusinessSetup(req.params.id);
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.business_setup,
    });
  } else {
    sendDeletionResponse({
      res,
      data: result,
      what: operableEntities.business_setup,
    });
  }
}
//
module.exports = {
  createBusinessSetup,
  updateBusinessSetup,
  deleteBusinessSetup,
  getBusinessSetup,
};
