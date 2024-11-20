const themeColorService = require("./themeColor.service");
const httpStatus = require("http-status");

const {
  sendCreateResponse,
  sendDeletionResponse,
  sendErrorResponse,
  sendFetchResponse,
  sendUpdateResponse,
} = require("../../../utils/responseHandler");
const { operableEntities } = require("../../../config/constants");

async function createThemeColor(req, res) {
  const result = await themeColorService.createThemeColor(req.body);
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.theme_color,
    });
  } else {
    sendCreateResponse({
      res,
      data: result,
      what: operableEntities.theme_color,
    });
  }
}

async function getThemeColors(req, res) {
  const result = await themeColorService.getThemeColors(req.query);
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.theme_color,
    });
  } else {
    sendFetchResponse({
      res,
      data: result,
      what: operableEntities.theme_color,
    });
  }
}
//
async function updateThemeColor(req, res) {
  const result = await themeColorService.updateThemeColor({
    id: req.params.id,
    data: req.body,
  });
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.theme_color,
    });
  } else {
    sendUpdateResponse({
      res,
      data: result,
      what: operableEntities.theme_color,
    });
  }
}
//
async function deleteThemeColor(req, res) {
  const result = await themeColorService.deleteThemeColor(req.params.id);
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.theme_color,
    });
  } else {
    sendDeletionResponse({
      res,
      data: result,
      what: operableEntities.theme_color,
    });
  }
}
//
module.exports = {
  createThemeColor,
  updateThemeColor,
  deleteThemeColor,
  getThemeColors,
};
