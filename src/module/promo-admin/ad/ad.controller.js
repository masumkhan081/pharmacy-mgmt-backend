const adService = require("./ad.service");
//
const {
  sendCreateResponse,
  sendDeletionResponse,
  sendErrorResponse,
  sendFetchResponse,
  sendUpdateResponse,
} = require("../../../utils/responseHandler");
//
const httpStatus = require("http-status");
const { promisify } = require("util");
const fs = require("fs");
const path = require("path");
const unlinkAsync = promisify(fs.unlink);
const { operableEntities } = require("../../../config/constants");

const Ad = require("./ad.model");
const { fieldsMap, uploadHandler } = require("../../../utils/uploader");
const { isPatchBodyValid, isPostBodyValid } = require("./ad.validate");
const { removeFile } = require("../../../utils/fileHandle");

//
async function getSingleAd(req, res, next) {
  try {
    const result = await adService.getSingleAd(req.params.id);
    if (result instanceof Error) {
      sendErrorResponse({
        res,
        error: result,
        what: operableEntities.ad,
      });
    } else {
      sendFetchResponse({ res, data: result, what: operableEntities.ad });
    }
  } catch (error) {
    sendErrorResponse({ res, error, what: operableEntities.ad });
  }
}

async function createAd(req, res, next) {
  try {
    const valid = isPostBodyValid({ files: req.files, bodyData: req.body });

    let fileUrl;
    //
    if (valid.success) {
      let fieldName = fieldsMap[operableEntities.ad][0].name;
      console.log(JSON.stringify(fieldName));
      fileUrl = await uploadHandler({
        what: fieldName,
        file: req.files[fieldName][0],
      });

      try {
        const addResult = await Ad.create({
          title: valid.title,
          is_active: valid.is_active,
          thumbnail: fileUrl,
          display_page: valid.display_page,
        });
        sendCreateResponse({
          res,
          what: operableEntities.ad,
          data: addResult,
        });
      } catch (error) {
        // await unlinkAsync(req.file.path);
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
async function updateAd(req, res) {
  try {
    const { title, display_page, is_active } = req.body;
    console.log(
      "title, display_page, is_active >> " + title,
      display_page,
      is_active
    );
    const idUpdatableAd = req.params.id;
    let fileUrl;
    let deleteUrl;
    //
    try {
      const updatableAd = await Ad.findById(idUpdatableAd);

      if (updatableAd) {
        if (req.files["ad_thumbnail"]) {
          let fieldName = fieldsMap[operableEntities.ad][0].name;
          fileUrl = await uploadHandler({
            what: fieldName,
            file: req.files[fieldName][0],
          });
          console.log("fileUrl:   " + fileUrl);
          removeFile({ fileUrl: updatableAd.thumbnail });
        }

        const editResult = await Ad.findByIdAndUpdate(
          idUpdatableAd,
          {
            title: title ? title : updatableAd.title,
            is_active: is_active ? is_active : updatableAd.is_active,
            display_page: display_page
              ? display_page
              : updatableAd.display_page,
            thumbnail: fileUrl ? fileUrl : updatableAd.thumbnail,
          },
          { new: true }
        );
        sendUpdateResponse({
          res,
          what: operableEntities.ad,
          data: editResult,
        });
      } else {
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
      sendErrorResponse({ res, error, what: operableEntities.ad });
    }
  } catch (error) {
    console.log("error cash ... 2");
    sendErrorResponse({ res, error, what: operableEntities.ad });
  }
}

async function getAds(req, res) {
  const result = await adService.getAds(req.query);
  if (result instanceof Error) {
    sendErrorResponse({ res, error: result, what: operableEntities.ad });
  } else {
    sendFetchResponse({ res, data: result, what: operableEntities.ad });
  }
}

//
async function deleteAd(req, res) {
  const result = await adService.deleteAd(req.params.id);
  if (result instanceof Error) {
    console.log("delete ad ----");
    sendErrorResponse({ res, error: result, what: operableEntities.ad });
  } else {
    sendDeletionResponse({ res, data: result, what: operableEntities.ad });
  }
}
//
module.exports = {
  createAd,
  updateAd,
  deleteAd,
  getAds,
  getSingleAd,
};
