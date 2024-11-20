const bannerService = require("./banner.service");
const Banner = require("./banner.model");
const httpStatus = require("http-status");

const fs = require("fs");
const path = require("path");

const {
  sendCreateResponse,
  sendDeletionResponse,
  sendErrorResponse,
  sendFetchResponse,
  sendUpdateResponse,
} = require("../../../utils/responseHandler");
const { operableEntities, file_config } = require("../../../config/constants");
const {
  storageMap,
  uploadBannerImage,
  removeFile,
} = require("../../../utils/fileHandle");
const { uploadHandler, fieldsMap } = require("../../../utils/uploader");
const { isPatchBodyValid, isPostBodyValid } = require("./banner.validate");
const config = require("../../../config");
//

async function getSingleBanner(req, res, next) {
  try {
    const result = await bannerService.getSingleBanner(req.params.id);
    if (result instanceof Error) {
      sendErrorResponse({
        res,
        error: result,
        what: operableEntities.banner,
      });
    } else {
      sendFetchResponse({ res, data: result, what: operableEntities.banner });
    }
  } catch (error) {
    sendErrorResponse({ res, error, what: operableEntities.banner });
  }
}

async function createBanner(req, res, next) {
  try {
    const valid = isPostBodyValid({ files: req.files, bodyData: req.body });
    let fileUrl;
    //
    if (valid.success) {
      let fieldName = fieldsMap[operableEntities.banner][0].name;
      fileUrl = await uploadHandler({
        what: fieldName,
        file: req.files[fieldName][0],
      });

      try {
        const addResult = await Banner.create({
          title: valid.title,
          is_active: valid.is_active,
          thumbnail: fileUrl,
        });
        sendCreateResponse({
          res,
          what: operableEntities.banner,
          data: addResult,
        });
      } catch (error) {
        removeFile(fileUrl);
        sendErrorResponse({ res, error, what: operableEntities.banner });
      }
    } else {
      res.status(400).send({ message: valid.message });
    }
  } catch (error) {
    // await unlinkAsync(req.file.path);
    sendErrorResponse({ res, error, what: operableEntities.banner });
  }
}

//
async function updateBanner(req, res) {
  try {
    const { title, is_active } = req.body;
    const idUpdatableId = req.params.id;
    let fileUrl;
    //
    try {
      const updatableBanner = await Banner.findById(idUpdatableId);
      if (updatableBanner) {
        if (req.files["banner_thumbnail"]) {
          let fieldName = fieldsMap[operableEntities.banner][0].name;
          fileUrl = await uploadHandler({
            what: fieldName,
            file: req.files[fieldName][0],
          });

          removeFile({ fileUrl: updatableBanner.thumbnail });
        }
        const editResult = await Banner.findByIdAndUpdate(
          idUpdatableId,
          {
            title: title ? title : updatableBanner.title,
            is_active: is_active ? is_active : updatableBanner.is_active,
            thumbnail: fileUrl ? fileUrl : updatableBanner.thumbnail,
          },
          { new: true }
        );
        sendUpdateResponse({
          res,
          what: operableEntities.banner,
          data: editResult,
        });
      } else {
        if (fileUrl) {
          await unlinkAsync(fileUrl);
        }
        res.status(404).send({
          success: false,
          status: 404,
          message: "Id not found",
        });
      }
    } catch (error) {
      console.log("error cash ... ");
      if (req.file.path) {
        await unlinkAsync(req.file.path);
      }
      sendErrorResponse({ res, error, what: operableEntities.banner });
    }
  } catch (error) {
    console.log("error cash ... 2");
    sendErrorResponse({ res, error, what: operableEntities.banner });
  }
}
//
async function getBanners(req, res) {
  const result = await bannerService.getBanners(req.query);
  if (result instanceof Error) {
    sendErrorResponse({ res, error: result, what: operableEntities.banner });
  } else {
    sendFetchResponse({ res, data: result, what: operableEntities.banner });
  }
}
//
async function deleteBanner(req, res) {
  const result = await bannerService.deleteBanner(req.params.id);
  if (result instanceof Error) {
    sendErrorResponse({ res, error: result, what: operableEntities.banner });
  } else {
    sendDeletionResponse({ res, data: result, what: operableEntities.banner });
  }
}
//
module.exports = {
  createBanner,
  updateBanner,
  deleteBanner,
  getBanners,
  getSingleBanner,
};
