const subCategoryService = require("./subCategory.service");
const httpStatus = require("http-status");

const SubCategory = require("./subCategory.model");
const {
  sendCreateResponse,
  sendDeletionResponse,
  sendErrorResponse,
  sendFetchResponse,
  sendUpdateResponse,
} = require("../../../utils/responseHandler");
const { operableEntities } = require("../../../config/constants");
const { removeFile } = require("../../../utils/fileHandle");
const { isPostBodyValid } = require("./subCategory.validate");
const { uploadHandler, fieldsMap } = require("../../../utils/uploader");

async function getSingleSubCategory(req, res) {
  try {
    const result = await subCategoryService.getSingleSubCategory(req.params.id);
    if (result instanceof Error) {
      sendErrorResponse({
        res,
        error: result,
        what: operableEntities.sub_category,
      });
    } else {
      sendFetchResponse({
        res,
        data: result,
        what: operableEntities.sub_category,
      });
    }
  } catch (error) {
    sendErrorResponse({ res, error, what: operableEntities.sub_category });
  }
}

async function createSubCategory(req, res) {
  try {
    const valid = isPostBodyValid({ files: req.files, bodyData: req.body });
    console.log(JSON.stringify(valid));
    let fileUrl;
    //
    if (valid.success) {
      let fieldName = fieldsMap[operableEntities.sub_category][0].name;
      if (req?.files?.[fieldName]) {
        console.log("fieldName:   " + JSON.stringify(fieldName));
        fileUrl = await uploadHandler({
          what: fieldName,
          file: req.files[fieldName][0],
        });
      }
      try {
        const addResult = await SubCategory.create({
          name: valid.name,
          category: valid.category,
          is_active: valid.is_active,
          thumbnail: fileUrl,
          description: valid.description,
        });

        // const categoryUpdate = await SubCategory.findByIdAndUpdate(
        //   addResult.id,
        //   { $push: { category: { $each: valid.categories } } },
        //   { new: true }
        // );
        // console.log("categoryUpdate:: "+JSON.stringify(categoryUpdate));

        // const updatedUser = await User.findByIdAndUpdate(
        //   userId,
        //   { $push: { hobbies: { $each: newHobbies } } }, // Push multiple hobbies
        //   { new: true }
        // );

        sendCreateResponse({
          res,
          what: operableEntities.sub_category,
          data: addResult,
        });
      } catch (error) {
        removeFile({ fileUrl });
        sendErrorResponse({ res, error, what: operableEntities.sub_category });
      }
    } else {
      res.status(400).send({ message: valid.message });
    }
  } catch (error) {
    sendErrorResponse({ res, error, what: operableEntities.sub_category });
  }
}
//
async function updateSubCategory(req, res) {
  try {
    const { name, category, description, is_active } = req.body;
    const updatableSubCategoryId = req.params.id;
    let fileUrl;
    //
    try {
      console.log(" before ....");
      const updatableSubCategory = await SubCategory.findById(
        updatableSubCategoryId
      );

      if (updatableSubCategory) {
        let fieldName = fieldsMap[operableEntities.sub_category][0].name;

        if (req?.files?.[fieldName]) {
          fileUrl = await uploadHandler({
            what: fieldName,
            file: req.files[fieldName][0],
          });
          removeFile({ fileUrl: updatableSubCategory.thumbnail });
        }
        try {
          const editResult = await SubCategory.findByIdAndUpdate(
            updatableSubCategoryId,
            {
              name: name ? name : updatableSubCategory.name,
              is_active: is_active ? is_active : updatableSubCategory.is_active,
              description: description
                ? description
                : updatableSubCategory.description,
              thumbnail: fileUrl ? fileUrl : updatableSubCategory.thumbnail,
              category: category ? category : updatableSubCategory.category,
            },
            { new: true }
          );
          sendUpdateResponse({
            res,
            what: operableEntities.sub_category,
            data: editResult,
          });
        } catch (error) {
          removeFile({ fileUrl });
          sendErrorResponse({
            res,
            error,
            what: operableEntities.sub_category,
          });
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
      sendErrorResponse({ res, error, what: operableEntities.sub_category });
    }
  } catch (error) {
    sendErrorResponse({ res, error, what: operableEntities.sub_category });
  }
}

async function getSubCategories(req, res) {
  const result = await subCategoryService.getSubCategories(req.query);
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.sub_category,
    });
  } else {
    sendFetchResponse({
      res,
      data: result,
      what: operableEntities.sub_category,
    });
  }
}

//
async function deleteSubCategory(req, res) {
  const result = await subCategoryService.deleteSubCategory(req.params.id);
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.sub_category,
    });
  } else {
    sendDeletionResponse({
      res,
      data: result,
      what: operableEntities.sub_category,
    });
  }
}
//
module.exports = {
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  getSubCategories,
  getSingleSubCategory,
};
