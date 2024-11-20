const aboutUsService = require("./aboutUs.service");
const {
  sendCreateResponse,
  sendDeletionResponse,
  sendErrorResponse,
  sendFetchResponse,
  sendUpdateResponse,
} = require("../../../utils/responseHandler");
const { operableEntities } = require("../../../config/constants");

async function createAboutUs(req, res) {
  const result = await aboutUsService.createAboutUs(req.body);
  if (result instanceof Error) {
    sendErrorResponse({ res, error: result, what: operableEntities.about_us });
  } else {
    sendCreateResponse({ res, data: result, what: operableEntities.about_us });
  }
}

async function getAboutUs(req, res) {
  const result = await aboutUsService.getAboutUs(req.query);
  if (result instanceof Error) {
    sendErrorResponse({ res, error: result, what: operableEntities.about_us });
  } else {
    sendFetchResponse({ res, data: result, what: operableEntities.about_us });
  }
}
//
async function updateAboutUs(req, res) {
  const result = await aboutUsService.updateAboutUs({
    id: req.params.id,
    data: req.body,
  });
  if (result instanceof Error) {
    sendErrorResponse({ res, error: result, what: operableEntities.about_us });
  } else {
    sendUpdateResponse({ res, data: result, what: operableEntities.about_us });
  }
}
//
async function deleteAboutUs(req, res) {
  const result = await aboutUsService.deleteAboutUs(req.params.id);
  if (result instanceof Error) {
    sendErrorResponse({ res, error: result, what: operableEntities.about_us });
  } else {
    sendDeletionResponse({
      res,
      data: result,
      what: operableEntities.about_us,
    });
  }
}
//
module.exports = {
  createAboutUs,
  updateAboutUs,
  deleteAboutUs,
  getAboutUs,
};
