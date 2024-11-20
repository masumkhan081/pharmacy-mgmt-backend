const colorService = require("./color.service");
const httpStatus = require("http-status");

const {
  sendCreateResponse,
  sendDeletionResponse,
  sendErrorResponse,
  sendFetchResponse,
  sendUpdateResponse,
} = require("../../../utils/responseHandler");
const { operableEntities } = require("../../../config/constants");
const { isPostBodyValid } = require("./color.validate");

async function getSingleColor(req, res) {
  try {
    const result = await colorService.getSingleColor(req.params.id);
    if (result instanceof Error) {
      sendErrorResponse({ res, error: result, what: operableEntities.color });
    } else {
      sendFetchResponse({ res, data: result, what: operableEntities.color });
    }
  } catch (error) {
    sendErrorResponse({ res, error, what: operableEntities.color });
  }
}
//
async function updateColorStatus(req, res) {
  try {
    const exist = await Color.findById(req.params.id);
    if (exist) {
      const result = await colorService.updateColorStatus({
        id: req.params.id,
        is_active: req.body.is_active,
      });
      if (result instanceof Error) {
        sendErrorResponse({ res, error: result, what: operableEntities.color });
      } else {
        sendUpdateResponse({ res, data: result, what: operableEntities.color });
      }
    } else {
      sendErrorResponse({
        res,
        error: responseMap.id_not_found,
        what: operableEntities.color,
      });
    }
  } catch (error) {
    sendErrorResponse({ res, error, what: operableEntities.color });
  }
}

async function createColor(req, res) {
  try {
    const valid = isPostBodyValid(req.body);
    if (valid.success) {
      const result = await colorService.createColor(req.body);
      if (result instanceof Error) {
        sendErrorResponse({ res, error: result, what: operableEntities.color });
      } else {
        sendCreateResponse({ res, data: result, what: operableEntities.color });
      }
    } else {
      res.status(400).send({ message: valid.message });
    }
  } catch (error) {
    sendErrorResponse({ res, error, what: operableEntities.color });
  }
}

async function getColors(req, res) {
  try {
    const result = await colorService.getColors(req.query);
    if (result instanceof Error) {
      sendErrorResponse({ res, error: result, what: operableEntities.color });
    } else {
      sendFetchResponse({ res, data: result, what: operableEntities.color });
    }
  } catch (error) {
    sendErrorResponse({ res, error, what: operableEntities.color });
  }
}
//
async function updateColor(req, res) {
  try {
    const result = await colorService.updateColor({
      id: req.params.id,
      data: req.body,
    });
    if (result instanceof Error) {
      sendErrorResponse({ res, error: result, what: operableEntities.color });
    } else {
      sendUpdateResponse({ res, data: result, what: operableEntities.color });
    }
  } catch (error) {
    sendErrorResponse({ res, error, what: operableEntities.color });
  }
}
//
async function deleteColor(req, res) {
  try {
    const result = await colorService.deleteColor(req.params.id);
    if (result instanceof Error) {
      sendErrorResponse({ res, error: result, what: operableEntities.color });
    } else {
      sendDeletionResponse({ res, data: result, what: operableEntities.color });
    }
  } catch (error) {
    sendErrorResponse({ res, error, what: operableEntities.color });
  }
}
//
module.exports = {
  createColor,
  updateColor,
  deleteColor,
  getColors,
  getSingleColor,
  updateColorStatus,
};
