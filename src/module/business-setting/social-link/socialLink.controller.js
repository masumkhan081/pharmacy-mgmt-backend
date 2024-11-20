const socialLinkService = require("./socialLink.service");
const SocialLink = require("./socialLink.model");

const {
  sendCreateResponse,
  sendDeletionResponse,
  sendErrorResponse,
  sendFetchResponse,
  sendUpdateResponse,
} = require("../../../utils/responseHandler");
const httpStatus = require("http-status");
const { promisify } = require("util");
const fs = require("fs");
const path = require("path");
const unlinkAsync = promisify(fs.unlink);
const { operableEntities } = require("../../../config/constants");
const { fieldsMap, uploadHandler } = require("../../../utils/uploader");
const { isPostBodyValid } = require("./socialLink.validate");
const SocialkLink = require("./socialLink.model");

async function createSocialLink(req, res, next) {
  try {
    const valid = isPostBodyValid({ files: req.files, bodyData: req.body });
    let fileUrl;
    console.log(JSON.stringify(valid));
    //
    if (valid.success) {
      let fieldName = fieldsMap[operableEntities.social_link][0].name;

      fileUrl = await uploadHandler({
        what: fieldName,
        file: req.files[fieldName][0],
      });

      console.log("fileUrl: " + fileUrl);

      try {
        const addResult = await SocialkLink.create({
          name: valid.name,
          is_active: valid.is_active,
          icon: fileUrl,
          link: valid.link,
        });
        sendCreateResponse({
          res,
          what: operableEntities.social_link,
          data: addResult,
        });
      } catch (error) {
        // await unlinkAsync(req.file.path);
        sendErrorResponse({ res, error, what: operableEntities.social_link });
      }
    } else {
      res.status(400).send({ message: valid.message });
    }
  } catch (error) {
    // await unlinkAsync(req.file.path);
    sendErrorResponse({ res, error, what: operableEntities.social_link });
  }
}
//
async function updateSocialLink(req, res) {
  try {
    const { name, link, is_active } = req.body;
    console.log("name, link, is_active >> " + name, link, is_active);
    const idUpdatableId = req.params.id;
    let fileUrl;
    //
    try {
      const updatableSclLink = await SocialLink.findById(idUpdatableId);
      if (updatableSclLink) {
        if (req.files["social_icon"]) {
          let fieldName = fieldsMap[operableEntities.social_link][0].name;
          fileUrl = await uploadHandler({
            what: fieldName,
            file: req.files[fieldName][0],
          });
          console.log("fileUrl:   " + fileUrl);

          const deleteUrl = path.join(
            __dirname,
            `../../../../${updatableSclLink.icon}`
          );

          console.log("deleteUrl:   " + deleteUrl);
          await unlinkAsync(deleteUrl);
          console.log("deleteUrl:   " + deleteUrl);
        }
        console.lo;
        const editResult = await SocialLink.findByIdAndUpdate(
          idUpdatableId,
          {
            name: name ? name : updatableSclLink.name,
            is_active: is_active ? is_active : updatableSclLink.is_active,
            link: link ? link : updatableSclLink.link,
            icon: fileUrl ? fileUrl : updatableSclLink.icon,
          },
          { new: true }
        );
        sendUpdateResponse({
          res,
          what: operableEntities.social_link,
          data: editResult,
        });
      } else {
        if (fileUrl) {
          await unlinkAsync(fileUrl);
        }
        res.send({
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
      sendErrorResponse({ res, error, what: operableEntities.social_link });
    }
  } catch (error) {
    console.log("error cash ... 2");
    sendErrorResponse({ res, error, what: operableEntities.social_link });
  }
}

//
async function getSocialLinks(req, res) {
  const result = await socialLinkService.getSocialLinks(req.query);
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.social_link,
    });
  } else {
    sendFetchResponse({
      res,
      data: result,
      what: operableEntities.social_link,
    });
  }
}
//
async function deleteSocialLink(req, res) {
  const result = await socialLinkService.deleteSocialLink(req.params.id);
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.social_link,
    });
  } else {
    sendDeletionResponse({
      res,
      data: result,
      what: operableEntities.social_link,
    });
  }
}
//
module.exports = {
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
  getSocialLinks,
};
