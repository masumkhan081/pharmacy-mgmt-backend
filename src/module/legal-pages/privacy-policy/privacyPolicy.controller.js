const privacyPolicyService = require("./privacyPolicy.service");
const PrivacyPolicy = require("./privacyPolicy.model");

const {
  sendCreateResponse,
  sendDeletionResponse,
  sendErrorResponse,
  sendFetchResponse,
  sendUpdateResponse,
} = require("../../../utils/responseHandler");
const { operableEntities } = require("../../../config/constants");
//

async function createPrivacyPolicy(req, res) {
  const result = await privacyPolicyService.createPrivacyPolicy(req.body);
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.privacy_policy,
    });
  } else {
    sendCreateResponse({
      res,
      data: result,
      what: operableEntities.privacy_policy,
    });
  }
}
//
async function getPrivacyPolicies(req, res) {
  const result = await privacyPolicyService.getPrivacyPolicies(req.query);
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.privacy_policy,
    });
  } else {
    sendFetchResponse({
      res,
      data: result,
      what: operableEntities.privacy_policy,
    });
  }
}
//
async function updatePrivacyPolicy(req, res) {
  const result = await privacyPolicyService.updatePrivacyPolicy({
    id: req.params.id,
    data: req.body,
  });
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.privacy_policy,
    });
  } else {
    sendUpdateResponse({
      res,
      data: result,
      what: operableEntities.privacy_policy,
    });
  }
}
//
async function deletePrivacyPolicy(req, res) {
  const result = await privacyPolicyService.deletePrivacyPolicy(req.params.id);
  if (result instanceof Error) {
    sendErrorResponse({
      res,
      error: result,
      what: operableEntities.privacy_policy,
    });
  } else {
    sendDeletionResponse({
      res,
      data: result,
      what: operableEntities.privacy_policy,
    });
  }
}
//
module.exports = {
  createPrivacyPolicy,
  updatePrivacyPolicy,
  deletePrivacyPolicy,
  getPrivacyPolicies,
};
