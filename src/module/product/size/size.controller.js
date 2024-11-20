const sizeService = require("./size.service");
const Size = require("./size.model");

const {
  sendCreateResponse,
  sendDeletionResponse,
  sendErrorResponse,
  sendFetchResponse,
  sendUpdateResponse,
  responseMap,
} = require("../../../utils/responseHandler");
const { operableEntities } = require("../../../config/constants");
const { isPostBodyValid } = require("./size.validate");
const Product = require("../product/product.model");

async function createSize(req, res) {
  try {
    const result = await sizeService.createSize(req.body);
    if (result instanceof Error) {
      sendErrorResponse({ res, error: result, what: operableEntities.size });
    } else {
      sendCreateResponse({ res, data: result, what: operableEntities.size });
    }
  } catch (error) {
    sendErrorResponse({ res, error, what: operableEntities.size });
  }
}
//
async function updateSizeStatus(req, res) {
  try {
    const exist = await Size.findById(req.params.id);
    if (exist) {
      const result = await sizeService.updateSizeStatus({
        id: req.params.id,
        is_active: req.body.is_active,
      });
      if (result instanceof Error) {
        sendErrorResponse({ res, error: result, what: operableEntities.size });
      } else {
        sendUpdateResponse({ res, data: result, what: operableEntities.size });
      }
    } else {
      sendErrorResponse({
        res,
        error: responseMap.id_not_found,
        what: operableEntities.size,
      });
    }
  } catch (error) {
    sendErrorResponse({ res, error, what: operableEntities.size });
  }
}

async function getSizes(req, res) {
  try {
    const result = await sizeService.getSizes(req.query);
    if (result instanceof Error) {
      sendErrorResponse({ res, error: result, what: operableEntities.size });
    } else {
      sendFetchResponse({ res, data: result, what: operableEntities.size });
    }
  } catch (error) {
    sendErrorResponse({ res, error, what: operableEntities.size });
  }
}
//
async function updateSize(req, res) {
  try {
    const exist = await Size.findById(req.params.id);
    if (exist) {
      const result = await sizeService.updateSize({
        id: req.params.id,
        data: req.body,
      });
      if (result instanceof Error) {
        sendErrorResponse({ res, error: result, what: operableEntities.size });
      } else {
        sendUpdateResponse({ res, data: result, what: operableEntities.size });
      }
    } else {
      sendErrorResponse({
        res,
        error: responseMap.id_not_found,
        what: operableEntities.size,
      });
    }
  } catch (error) {
    sendErrorResponse({ res, error, what: operableEntities.size });
  }
}
//
async function getSingleSize(req, res) {
  try {
    const result = await sizeService.getSingleSize(req.params.id);
    if (result instanceof Error) {
      sendErrorResponse({ res, error: result, what: operableEntities.size });
    } else {
      sendFetchResponse({ res, data: result, what: operableEntities.size });
    }
  } catch (error) {
    sendErrorResponse({ res, error, what: operableEntities.size });
  }
}
//
async function deleteSize(req, res) {
  try {
    const exist = await Size.findById(req.params.id);
    console.log(exist);
    if (exist) {
      const isUsed = await Product.countDocuments({
        size: req.params.id,
      });
      console.log("isUsed: " + isUsed);

      if (isUsed === 0) {
        const result = await sizeService.deleteSize(req.params.id);
        if (result instanceof Error) {
          sendErrorResponse({
            res,
            error: result,
            what: operableEntities.size,
          });
        } else {
          sendDeletionResponse({
            res,
            data: result,
            what: operableEntities.size,
          });
        }
      } else {
        sendErrorResponse({
          res,
          error: responseMap.already_used,
          what: operableEntities.size,
        });
      }
    } else {
      sendErrorResponse({
        res,
        error: responseMap.id_not_found,
        what: operableEntities.size,
      });
    }
  } catch (error) {
    sendErrorResponse({ res, error, what: operableEntities.size });
  }
}
//
module.exports = {
  createSize,
  updateSize,
  deleteSize,
  getSizes,
  getSingleSize,
  updateSizeStatus,
};
