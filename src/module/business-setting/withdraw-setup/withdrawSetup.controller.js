const withdrawSetupService = require("./withdrawSetup.service");
const httpStatus = require("http-status");
const {
  sendCreateResponse,
  sendDeletionResponse,
  sendErrorResponse,
  sendFetchResponse,
  sendUpdateResponse,
} = require("../../../utils/responseHandler");
const { operableEntities } = require("../../../config/constants");

async function createWithdrawSetting(req, res) {
  const result = await withdrawSetupService.createWithdrawSetting(req.body);
  if (result instanceof Error) {
    sendErrorResponse({ res, error: result, what: operableEntities.address });
  } else {
    sendCreateResponse({ res, data: result, what: operableEntities.address });
  }
}

async function getWithdrawSettings(req, res) {
  const result = await withdrawSetupService.getWithdrawSettings(req.query);
  if (result instanceof Error) {
    sendErrorResponse({ res, error: result, what: operableEntities.address });
  } else {
    sendFetchResponse({ res, data: result, what: operableEntities.address });
  }
}
//
async function updateWithdrawSetting(req, res) {
  const result = await withdrawSetupService.updateWithdrawSetting({
    id: req.params.id,
    data: req.body,
  });
  if (result instanceof Error) {
    sendErrorResponse({ res, error: result, what: operableEntities.address });
  } else {
    sendUpdateResponse({ res, data: result, what: operableEntities.address });
  }
}
//
async function deleteWithdrawSetting(req, res) {
  const result = await withdrawSetupService.deleteWithdrawSetting(
    req.params.id
  );
  if (result instanceof Error) {
    sendErrorResponse({ res, error: result, what: operableEntities.address });
  } else {
    sendDeletionResponse({ res, data: result, what: operableEntities.address });
  }
}
//
module.exports = {
  createWithdrawSetting,
  updateWithdrawSetting,
  deleteWithdrawSetting,
  getWithdrawSettings,
};
