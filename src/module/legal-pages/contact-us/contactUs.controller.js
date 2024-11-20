const contactUsService = require("./contactUs.service");
const httpStatus = require("http-status");

const {
  sendCreateResponse,
  sendDeletionResponse,
  sendErrorResponse,
  sendFetchResponse,
  sendUpdateResponse,
} = require("../../../utils/responseHandler");
const { operableEntities } = require("../../../config/constants");

async function createContactUs(req, res) {
  const result = await contactUsService.createContactUs(req.body);
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.contact_us,
    });
  } else {
    sendCreateResponse({
      res,
      data: result,
      what: operableEntities.contact_us,
    });
  }
}

async function getContactUs(req, res) {
  const result = await contactUsService.getContactUs(req.query);
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.contact_us,
    });
  } else {
    sendFetchResponse({ res, data: result, what: operableEntities.contact_us });
  }
}
//
async function updateContactUs(req, res) {
  const result = await contactUsService.updateContactUs({
    id: req.params.id,
    data: req.body,
  });
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.contact_us,
    });
  } else {
    sendUpdateResponse({
      res,
      data: result,
      what: operableEntities.contact_us,
    });
  }
}
//
async function deleteContactUs(req, res) {
  const result = await contactUsService.deleteContactUs(req.params.id);
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.contact_us,
    });
  } else {
    sendDeletionResponse({
      res,
      data: result,
      what: operableEntities.contact_us,
    });
  }
}
//
module.exports = {
  createContactUs,
  updateContactUs,
  deleteContactUs,
  getContactUs,
};
