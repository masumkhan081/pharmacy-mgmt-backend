const categoryService = require("./category.service");
const httpStatus = require("http-status");
const { promisify } = require("util");
const fs = require("fs");
const path = require("path");
const unlinkAsync = promisify(fs.unlink);
const Category = require("./category.model");
const {
  sendCreateResponse,
  sendDeletionResponse,
  sendErrorResponse,
  sendFetchResponse,
  sendUpdateResponse,
} = require("../../../utils/responseHandler");
const { operableEntities } = require("../../../config/constants");
const { removeFile } = require("../../../utils/fileHandle");
const { isPostBodyValid } = require("./category.validate");
const { uploadHandler, fieldsMap } = require("../../../utils/uploader");

async function getSingleCategory(req, res) {
  try {
    const result = await categoryService.getSingleCategory(req.params.id);
    if (result instanceof Error) {
      sendErrorResponse({
        res,
        error: result,
        what: operableEntities.category,
      });
    } else {
      sendFetchResponse({ res, data: result, what: operableEntities.category });
    }
  } catch (error) {
    sendErrorResponse({ res, error, what: operableEntities.category });
  }
}

async function createProductCategory(req, res) {
  try {
    const valid = isPostBodyValid({ files: req.files, bodyData: req.body });
    let fileUrl;
    //
    if (valid.success) {
      let fieldName = fieldsMap[operableEntities.category][0].name;
      console.log("fieldName::       " + fieldName);
      if (req.files[fieldName]) {
        console.log("fieldName:   " + fieldName);
        fileUrl = await uploadHandler({
          what: fieldName,
          file: req.files[fieldName][0],
        });
      }

      try {
        const addResult = await Category.create({
          name: valid.name,
          is_active: valid.is_active,
          thumbnail: fileUrl,
          description: valid.description,
        });
        sendCreateResponse({
          res,
          what: operableEntities.category,
          data: addResult,
        });
      } catch (error) {
        removeFile({ fileUrl });
        sendErrorResponse({ res, error, what: operableEntities.category });
      }
    } else {
      res.status(400).send({ message: valid.message });
    }
  } catch (error) {
    sendErrorResponse({ res, error, what: operableEntities.category });
  }
}
//
async function updateCategory(req, res) {
  try {
    const { name, description, is_active } = req.body;
    const updatableCategoryId = req.params.id;
    let fileUrl;
    try {
      const updatableCategory = await Category.findById(updatableCategoryId);

      if (updatableCategory) {
        let fieldName = fieldsMap[operableEntities.category][0].name;

        if (req?.files?.[fieldName]) {
          fileUrl = await uploadHandler({
            what: fieldName,
            file: req.files[fieldName][0],
          });
          removeFile({ fileUrl: updatableCategory.thumbnail });
        }
        try {
          const editResult = await Category.findByIdAndUpdate(
            updatableCategoryId,
            {
              name: name ? name : updatableCategory.name,
              is_active: is_active ? is_active : updatableCategory.is_active,
              description: description
                ? description
                : updatableCategory.description,
              thumbnail: fileUrl ? fileUrl : updatableCategory.thumbnail,
            },
            { new: true }
          );
          sendUpdateResponse({
            res,
            what: operableEntities.category,
            data: editResult,
          });
        } catch (error) {
          removeFile({ fileUrl });
          sendErrorResponse({ res, error, what: operableEntities.category });
        }
      } else {
        res.status(404).send({
          success: false,
          status: 404,
          message: "Id not found",
        });
      }
    } catch (error) {
      removeFile({ fileUrl });
      sendErrorResponse({ res, error, what: operableEntities.category });
    }
  } catch (error) {
    sendErrorResponse({ res, error, what: operableEntities.category });
  }
}
//
async function getCategories(req, res) {
  const result = await categoryService.getCategories(req.query);
  if (result instanceof Error) {
    sendErrorResponse({ res, error: result, what: operableEntities.category });
  } else {
    sendFetchResponse({ res, data: result, what: operableEntities.category });
  }
}
//
async function deleteCategory(req, res) {
  const result = await categoryService.deleteCategory(req.params.id);
  if (result instanceof Error) {
    sendErrorResponse({ res, error: result, what: operableEntities.category });
  } else {
    sendDeletionResponse({
      res,
      data: result,
      what: operableEntities.category,
    });
  }
}
//
module.exports = {
  createProductCategory,
  updateCategory,
  deleteCategory,
  getCategories,
  getSingleCategory
};
