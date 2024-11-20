const unitService = require("./unit.service");
const Unit = require("./unit.model");
const {
  sendCreateResponse,
  sendDeletionResponse,
  sendErrorResponse,
  sendFetchResponse,
  sendUpdateResponse,
  responseMap,
} = require("../../../utils/responseHandler");
const { operableEntities } = require("../../../config/constants");
const Product = require("../product/product.model");
//

async function getSingleUnit(req, res) {
  try {
    const result = await unitService.getSingleUnit(req.params.id);
    if (result instanceof Error) {
      sendErrorResponse({ res, error: result, what: operableEntities.unit });
    } else {
      sendFetchResponse({ res, data: result, what: operableEntities.unit });
    }
  } catch (error) {
    sendErrorResponse({ res, error, what: operableEntities.unit });
  }
}
//
async function createUnit(req, res) {
  try {
    const result = await unitService.createUnit(req.body);
    if (result instanceof Error) {
      sendErrorResponse({ res, error: result, what: operableEntities.unit });
    } else {
      sendCreateResponse({ res, data: result, what: operableEntities.unit });
    }
  } catch (error) {
    sendErrorResponse({ res, error, what: operableEntities.unit });
  }
}

async function getUnits(req, res) {
  try {
    const result = await unitService.getUnits(req.query);
    if (result instanceof Error) {
      sendErrorResponse({ res, error: result, what: operableEntities.unit });
    } else {
      sendFetchResponse({ res, data: result, what: operableEntities.unit });
    }
  } catch (error) {
    sendErrorResponse({ res, error, what: operableEntities.unit });
  }
}
//
async function updateUnit(req, res) {
  try {
    const result = await unitService.updateUnit({
      id: req.params.id,
      data: req.body,
    });
    if (result instanceof Error) {
      sendErrorResponse({ res, error: result, what: operableEntities.unit });
    } else {
      sendUpdateResponse({ res, data: result, what: operableEntities.unit });
    }
  } catch (error) {
    sendErrorResponse({ res, error, what: operableEntities.unit });
  }
}
//
async function deleteUnit(req, res) {
  try {
    const exist = await Unit.findById(req.params.id);

    if (exist) {
      const isUsed = await Product.countDocuments({
        unit: req.params.id,
      });
      console.log("isUsed: " + isUsed);

      if (isUsed === 0) {
        const result = await unitService.deleteUnit(req.params.id);
        if (result instanceof Error) {
          sendErrorResponse({
            res,
            error: result,
            what: operableEntities.unit,
          });
        } else {
          sendDeletionResponse({
            res,
            data: result,
            what: operableEntities.unit,
          });
        }
      } else {
        sendErrorResponse({
          res,
          error: responseMap.already_used,
          what: operableEntities.unit,
        });
      }
    } else {
      sendErrorResponse({
        res,
        error: responseMap.id_not_found,
        what: operableEntities.unit,
      });
    }
  } catch (error) {
    sendErrorResponse({ res, error, what: operableEntities.unit });
  }
}
//
async function updateUnitStatus(req, res) {
  try {
    const exist = await Unit.findById(req.params.id);
    if (exist) {
      const result = await unitService.updateUnitStatus({
        id: req.params.id,
        is_active: req.body.is_active,
      });
      if (result instanceof Error) {
        sendErrorResponse({ res, error: result, what: operableEntities.unit });
      } else {
        sendUpdateResponse({ res, data: result, what: operableEntities.unit });
      }
    } else {
      sendErrorResponse({
        res,
        error: responseMap.id_not_found,
        what: operableEntities.unit,
      });
    }
  } catch (error) {
    sendErrorResponse({ res, error, what: operableEntities.size });
  }
}
//
module.exports = {
  createUnit,
  updateUnit,
  deleteUnit,
  getUnits,
  getSingleUnit,
  updateUnitStatus,
};
