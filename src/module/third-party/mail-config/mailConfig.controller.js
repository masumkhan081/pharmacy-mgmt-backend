const mailConfigService = require("./mailConfig.service");
const httpStatus = require("http-status");

const {
  sendCreateResponse,
  sendDeletionResponse,
  sendErrorResponse,
  sendFetchResponse,
  sendUpdateResponse,
} = require("../../../utils/responseHandler");
const { operableEntities } = require("../../../config/constants");

async function createMailConfig(req, res) {
  const result = await mailConfigService.createMailConfig(req.body);
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.mail_config,
    });
  } else {
    sendCreateResponse({
      res,
      data: result,
      what: operableEntities.mail_config,
    });
  }
}

async function getMailConfig(req, res) {
  const result = await mailConfigService.getMailConfig(req.query);
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.mail_config,
    });
  } else {
    sendFetchResponse({
      res,
      data: result,
      what: operableEntities.mail_config,
    });
  }
}
//
async function updateMailConfig(req, res) {
  const result = await mailConfigService.updateMailConfig({
    id: req.params.id,
    data: req.body,
  });
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.mail_config,
    });
  } else {
    sendUpdateResponse({
      res,
      data: result,
      what: operableEntities.mail_config,
    });
  }
}
//
async function deleteMailConfig(req, res) {
  const result = await mailConfigService.deleteMailConfig(req.params.id);
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.mail_config,
    });
  } else {
    sendDeletionResponse({
      res,
      data: result,
      what: operableEntities.mail_config,
    });
  }
}
//
module.exports = {
  createMailConfig,
  updateMailConfig,
  deleteMailConfig,
  getMailConfig,
};
