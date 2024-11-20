const quickLinkService = require("./quickLink.service");
const httpStatus = require("http-status");
const QuickLink = require("./quickLink.model");
const {
  sendCreateResponse,
  sendDeletionResponse,
  sendErrorResponse,
  sendFetchResponse,
  sendUpdateResponse,
} = require("../../../utils/responseHandler");
const { operableEntities } = require("../../../config/constants");
const { uploadSocialIcon } = require("../../../utils/fileHandle");

async function createQuickLink(req, res) {
  const result = await quickLinkService.createQuickLink(req.body);
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.quick_link,
    });
  } else {
    sendCreateResponse({
      res,
      data: result,
      what: operableEntities.quick_link,
    });
  }
}

//

async function updateQuickLink(req, res) {
  const result = await quickLinkService.updateQuickLink({
    id: req.params.id,
    data: req.body,
  });
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.quick_link,
    });
  } else {
    sendUpdateResponse({
      res,
      data: result,
      what: operableEntities.quick_link,
    });
  }
}

//
async function getQuickLinks(req, res) {
  const result = await quickLinkService.getQuickLinks(req.query);
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.quick_link,
    });
  } else {
    sendFetchResponse({
      res,
      data: result,
      what: operableEntities.quick_link,
    });
  }
}
//
async function deleteQuickLink(req, res) {
  const result = await quickLinkService.deleteQuickLink(req.params.id);
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.quick_link,
    });
  } else {
    sendDeletionResponse({
      res,
      data: result,
      what: operableEntities.quick_link,
    });
  }
}
//
module.exports = {
  createQuickLink,
  updateQuickLink,
  deleteQuickLink,
  getQuickLinks,
};
