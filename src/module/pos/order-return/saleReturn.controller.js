const addressService = require("../services/address.service");
const httpStatus = require("http-status");

const {
  sendCreateResponse,
  sendDeletionResponse,
  sendErrorResponse,
  sendFetchResponse,
  sendUpdateResponse,
} = require("../utils/responseHandler");
const { operableEntities } = require("../config/constants");

async function createSaleReturn(req, res) {
  const result = await addressService.createSaleReturn(req.body);
  if (result instanceof Error) {
    sendErrorResponse({ res, error: result, what: operableEntities.address });
  } else {
    sendCreateResponse({ res, data: result, what: operableEntities.address });
  }
}

async function getAddresses(req, res) {
  const result = await addressService.getAddresses(req.query);
  if (result instanceof Error) {
    sendErrorResponse({ res, error: result, what: operableEntities.address });
  } else {
    sendFetchResponse({ res, data: result, what: operableEntities.address });
  }
}
//
async function updateAddress(req, res) {
  const result = await addressService.updateAddress({
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
async function deleteAddress(req, res) {
  const result = await addressService.deleteAddress(req.params.id);
  if (result instanceof Error) {
    sendErrorResponse({ res, error: result, what: operableEntities.address });
  } else {
    sendDeletionResponse({ res, data: result, what: operableEntities.address });
  }
}
//
module.exports = {
  createSaleReturn,
  updateAddress,
  deleteAddress,
  getAddresses,
};
