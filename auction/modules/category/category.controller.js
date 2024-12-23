const categoryService = require("./category.service");
const httpStatus = require("http-status");
const Category = require("./category.model");
const {
  sendCreateResponse,
  sendDeletionResponse,
  sendErrorResponse,
  sendFetchResponse,
  sendUpdateResponse,
  responseMap,
  sendSingleFetchResponse,
} = require("../../utils/responseHandler");
const { entities } = require("../../config/constants");
const productModel = require("../product/product.model");
//
async function getSingleCategory(req, res) {
  try {
    const result = await categoryService.getSingleCategory(req.params.id);
    if (result instanceof Error) {
      return sendErrorResponse({
        res,
        error: result,
        entity: entities.unit,
      });
    }
    sendSingleFetchResponse({
      res,
      data: result,
      entity: entities.unit,
    });
  } catch (error) {
    sendErrorResponse({ res, error, entity: entities.unit });
  }
}

async function createProductCategory(req, res) {
  try {
    const addResult = await categoryService.createCategory(req.body);

    sendCreateResponse({
      res,
      entity: entities.unit,
      data: addResult,
    });
  } catch (error) {
    sendErrorResponse({ res, error, entity: entities.unit });
  }
}
//
async function updateCategory(req, res) {
  try {
    const result = await categoryService.updateCategory({
      id: req.params.id,
      data: req.body,
    });

    return sendUpdateResponse({
      res,
      data: result,
      entity: entities.unit,
    });
  } catch (error) {
    sendErrorResponse({ res, error, entity: entities.unit });
  }
}
//
async function getCategories(req, res) {
  try {
    const result = await categoryService.getCategories(req.query);
    sendFetchResponse({ res, data: result, entity: entities.unit });
  } catch (error) {
    sendErrorResponse({
      res,
      error,
      entity: entities.unit,
    });
  }
}

//
async function deleteCategory(req, res) {
  try {
    const isUsed = await productModel.countDocuments({
      category: req.params.id,
    });

    if (isUsed > 0) {
      return sendErrorResponse({
        res,
        error: responseMap.alreadyUsed,
        entity: entities.unit,
      });
    }

    const result = await categoryService.deleteCategory(req.params.id);
    return sendDeletionResponse({
      res,
      data: result,
      entity: entities.unit,
    });
  } catch (error) {
    sendErrorResponse({
      res,
      error,
      entity: entities.unit,
    });
  }
}

//
module.exports = {
  createProductCategory,
  updateCategory,
  deleteCategory,
  getCategories,
  getSingleCategory,
};
