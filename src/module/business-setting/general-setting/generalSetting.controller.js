const generalSettingService = require("./generalSetting.service");

const httpStatus = require("http-status");
const { promisify } = require("util");
const fs = require("fs");
const path = require("path");
const unlinkAsync = promisify(fs.unlink);
const {
  sendCreateResponse,
  sendDeletionResponse,
  sendErrorResponse,
  sendFetchResponse,
  sendUpdateResponse,
} = require("../../../utils/responseHandler");
const { operableEntities } = require("../../../config/constants");
const { fieldsMap, uploadHandler } = require("../../../utils/uploader");
const { isPostBodyValid } = require("./generalSetting.validate");
const GeneralSetting = require("./generalSetting.model");

async function createGeneralSetting(req, res) {
  let paths = {};
  try {
    const valid = isPostBodyValid({ files: req.files, bodyData: req.body });

    if (valid.success) {
      let len = fieldsMap[operableEntities.general_setting].length;
      for (let i = 0; i < len; i++) {
        let fieldName = fieldsMap[operableEntities.general_setting][i].name;
        paths[fieldName] = await uploadHandler({
          what: fieldName,
          file: req.files[fieldName][0],
        });
      }
      try {
        const addResultGeneralSetting = await GeneralSetting.create({
          website_name: valid.website_name,
          website_title: valid.website_title,
          website_logo: paths["website_logo"],
          textual_logo: paths["textual_logo"],
          footer_section: {
            phone: valid.footer_phone,
            email: valid.footer_mail,
            text: valid.footer_text,
            address: valid.footer_address,
            description: valid.footer_description,
          },
          app_links: {
            is_app_link_visible: valid.is_app_link_visible,
            appstore_link: valid.appstore_link,
            playstore_link: valid.playstore_link,
          },
        });
        sendCreateResponse({
          res,
          what: operableEntities.general_setting,
          data: addResultGeneralSetting,
        });
      } catch (error) {
        console.log(JSON.stringify(error));
        sendErrorResponse({ res, error, what });
      }
    } else {
      res.status(400).send({ message: valid.message });
    }
  } catch (error) {
    sendErrorResponse({ res, error, what: operableEntities.shop });
  }
}
async function updateGeneralSetting(req, res) {
  let paths = {};
  let fileUrl;
  let deleteUrl;

  try {
    const {
      website_name,
      website_title,
      footer_address,
      footer_description,
      footer_mail,
      footer_phone,
      footer_text,
      playstore_link,
      appstore_link,
      is_app_link_visible,
    } = req.body;
    const idGeneralSetting = req.params.id;
    const updatableGeneralSetting = await GeneralSetting.findById(
      idGeneralSetting
    );
    if (updatableGeneralSetting) {
      let len = fieldsMap[operableEntities.general_setting].length;
      for (let i = 0; i < len; i++) {
        let fieldName = fieldsMap[operableEntities.general_setting][i].name;

        if (req.files[fieldName]) {
          fileUrl = await uploadHandler({
            what: fieldName,
            file: req.files[fieldName][0],
          });
          deleteUrl = path.join(
            __dirname,
            `../../../../${updatableGeneralSetting[fieldName]}`
          );
          paths[fieldName] = fileUrl;
          await unlinkAsync(deleteUrl);
          console.log("deleteUrl: ---- " + deleteUrl);

          // const newAppLinks = {
          //   appstore_link: appstore_link
          //     ? appstore_link
          //     : updatableGeneralSetting.app_links.appstore_link,
          //   playstore_link: playstore_link
          //     ? playstore_link
          //     : updatableGeneralSetting.app_links.playstore_link,
          // };
        }
      }
      try {
        const editResultGeneralSetting = await GeneralSetting.findByIdAndUpdate(
          idGeneralSetting, // Match by ID
          {
            $set: {
              website_name: website_name
                ? website_name
                : updatableGeneralSetting.website_name,
              website_title: website_title
                ? website_title
                : updatableGeneralSetting.website_title,
              website_logo: paths["website_logo"]
                ? paths["website_logo"]
                : updatableGeneralSetting.website_logo,
              textual_logo: paths["textual_logo"]
                ? paths["textual_logo"]
                : updatableGeneralSetting.textual_logo,
              footer_section: {
                phone: footer_phone
                  ? footer_phone
                  : updatableGeneralSetting.footer_section.footer_phone,
                email: footer_mail
                  ? footer_mail
                  : updatableGeneralSetting.footer_section.footer_mail,
                text: footer_text
                  ? footer_text
                  : updatableGeneralSetting.footer_section.footer_text,
                address: footer_address
                  ? footer_address
                  : updatableGeneralSetting.footer_section.footer_address,
                description: footer_description
                  ? footer_description
                  : updatableGeneralSetting.footer_section.footer_description,
              },
              app_links: {
                is_app_link_visible: is_app_link_visible
                  ? is_app_link_visible
                  : updatableGeneralSetting.app_links.is_app_link_visible,
                appstore_link: appstore_link
                  ? appstore_link
                  : updatableGeneralSetting.app_links.appstore_link,
                playstore_link: playstore_link
                  ? playstore_link
                  : updatableGeneralSetting.app_links.playstore_link,
              },
            },
          },
          { new: true } // Return the updated document
        );

        sendCreateResponse({
          res,
          what: operableEntities.general_setting,
          data: editResultGeneralSetting,
        });
      } catch (error) {
        console.log(JSON.stringify(error));
      }
    } else {
      res.status(404).send({
        success: false,
        status: 404,
        message: "Id not found",
      });
    }
  } catch (error) {
    sendErrorResponse({ res, error, what: operableEntities.general_setting });
  }
}

async function getGeneralSettings(req, res) {
  const result = await generalSettingService.getGeneralSettings(req.query);
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.general_setting,
    });
  } else {
    sendFetchResponse({
      res,
      data: result,
      what: operableEntities.general_setting,
    });
  }
}
//

//
async function deleteGeneralSetting(req, res) {
  const result = await generalSettingService.deleteGneeralSetting(
    req.params.id
  );
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.general_setting,
    });
  } else {
    sendDeletionResponse({
      res,
      data: result,
      what: operableEntities.general_setting,
    });
  }
}
//
module.exports = {
  createGeneralSetting,
  updateGeneralSetting,
  deleteGeneralSetting,
  getGeneralSettings,
};
