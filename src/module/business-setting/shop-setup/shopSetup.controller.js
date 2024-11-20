const shopSetupService = require("./shopSetup.service");
const httpStatus = require("http-status");

const {
  sendCreateResponse,
  sendDeletionResponse,
  sendErrorResponse,
  sendFetchResponse,
  sendUpdateResponse,
} = require("../../../utils/responseHandler");
const { operableEntities } = require("../../../config/constants");

async function createShopSetup(req, res) {
  const result = await shopSetupService.createShopSetting(req.body);
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.shop_setting,
    });
  } else {
    sendCreateResponse({
      res,
      data: result,
      what: operableEntities.shop_setting,
    });
  }
}

async function getShopSettings(req, res) {
  const result = await shopSetupService.getShopSettings(req.query);
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.shop_setting,
    });
  } else {
    sendFetchResponse({
      res,
      data: result,
      what: operableEntities.shop_setting,
    });
  }
}
//
async function updateShopSetting(req, res) {
  const result = await shopSetupService.updateShopSetting({
    id: req.params.id,
    data: req.body,
  });
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.shop_setting,
    });
  } else {
    sendUpdateResponse({
      res,
      data: result,
      what: operableEntities.shop_setting,
    });
  }
}
//
async function deleteShopSetting(req, res) {
  const result = await shopSetupService.deleteShopSetting(req.params.id);
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.shop_setting,
    });
  } else {
    sendDeletionResponse({
      res,
      data: result,
      what: operableEntities.shop_setting,
    });
  }
}
//
module.exports = {
  createShopSetup,
  updateShopSetting,
  deleteShopSetting,
  getShopSettings,
};
