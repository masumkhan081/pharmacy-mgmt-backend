/* eslint-disable no-unused-vars */
const { operableEntities } = require("../../../config/constants");
const PrivacyPolicy = require("./privacyPolicy.model");
const { getSearchAndPagination } = require("../../../utils/pagination");
//
async function createPrivacyPolicy(data) {
  try {
    const addResult = await PrivacyPolicy.create(data);
    return addResult;
  } catch (error) {
    return error;
  }
}
//
async function updatePrivacyPolicy({ id, data }) {
  try {
    const updateResult = await PrivacyPolicy.findByIdAndUpdate(id, data, {
      new: true,
    });
    return updateResult;
  } catch (error) {
    return error;
  }
}
//
async function getPrivacyPolicies(query) {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      filterConditions,
      sortConditions,
    } = getSearchAndPagination({
      query,
      what: operableEntities.privacy_policy,
    });

    const fetchResult = await PrivacyPolicy.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await PrivacyPolicy.countDocuments(filterConditions);
    return {
      meta: {
        total,
        limit: viewLimit,
        page: currentPage,
        skip: viewSkip,
        sortBy,
        sortOrder,
      },
      data: fetchResult,
    };
  } catch (error) {
    return error;
  }
}
//
async function deletePrivacyPolicy(id) {
  try {
    const deleteResult = await PrivacyPolicy.findByIdAndDelete(id);
    return deleteResult;
  } catch (error) {
    return error;
  }
}
//
module.exports = {
  createPrivacyPolicy,
  updatePrivacyPolicy,
  deletePrivacyPolicy,
  getPrivacyPolicies,
};
