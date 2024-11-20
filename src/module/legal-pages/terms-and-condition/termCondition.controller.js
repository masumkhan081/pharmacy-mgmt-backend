const termConditionService = require("./termCondition.service");
const {
  isPostBodyValid,
  isPatchBodyValid,
} = require("./termCondition.validate");
const {
  sendCreateResponse,
  sendDeletionResponse,
  sendErrorResponse,
  sendFetchResponse,
  sendUpdateResponse,
} = require("../../../utils/responseHandler");
const { operableEntities } = require("../../../config/constants");
//

async function createTermCondition(req, res) {
  const result = await termConditionService.createBrand(req.body);
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.terms_and_conditions,
    });
  } else {
    sendCreateResponse({
      res,
      data: result,
      what: operableEntities.terms_and_conditions,
    });
  }
}

async function getTermCondition(req, res) {
  const result = await termConditionService.getBrands(req.query);
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.terms_and_conditions,
    });
  } else {
    sendFetchResponse({
      res,
      data: result,
      what: operableEntities.terms_and_conditions,
    });
  }
}
//
async function updateTermCondition(req, res) {
  const result = await termConditionService.updateBrand({
    id: req.params.id,
    data: req.body,
  });
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.terms_and_conditions,
    });
  } else {
    sendUpdateResponse({
      res,
      data: result,
      what: operableEntities.terms_and_conditions,
    });
  }
}
//
async function deleteTermCondition(req, res) {
  const result = await termConditionService.deleteBrand(req.params.id);
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.terms_and_conditions,
    });
  } else {
    sendDeletionResponse({
      res,
      data: result,
      what: operableEntities.terms_and_conditions,
    });
  }
}
//
module.exports = {
  createTermCondition,
  updateTermCondition,
  deleteTermCondition,
  getTermCondition,
};
